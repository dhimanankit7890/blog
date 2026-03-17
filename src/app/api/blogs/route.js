import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("blog_db");
    
    // Sort by date or id to show newest first
    const blogs = await db.collection("blogs").find({}).sort({ _id: -1 }).toArray();
    
    // Convert ObjectId to string for easy frontend consumption
    const formattedBlogs = blogs.map(blog => ({
      ...blog,
      id: blog._id.toString(),
      _id: blog._id.toString()
    }));
    
    return NextResponse.json(formattedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("blog_db");
    
    // Check if body has the required fields
    if (!body.title || !body.desc) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }
    
    const newBlog = {
      title: body.title,
      image: body.image || "",
      desc: body.desc,
      date: body.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      logo: body.logo || "/logo.png",
      authorName: body.authorName || "My Portfolio",
      createdAt: new Date()
    };
    
    const result = await db.collection("blogs").insertOne(newBlog);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId.toString(),
      message: "Blog created successfully" 
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "Failed to create blog", details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }
    
    // Remove _id if it's in updateData to prevent trying to update the immutable _id field
    delete updateData._id;
    
    const client = await clientPromise;
    const db = client.db("blog_db");
    
    const result = await db.collection("blogs").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Blog updated successfully" });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("blog_db");
    
    const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
