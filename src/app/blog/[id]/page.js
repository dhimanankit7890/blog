import Link from "next/link";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

export const revalidate = 0; // Force dynamic rendering so new blogs show immediately

export default async function SingleBlogPage({ params }) {
  let blog = null;
  
  try {
    const resolvedParams = await params;
    const client = await clientPromise;
    const db = client.db("blog_db");
    
    const blogDoc = await db.collection("blogs").findOne({ _id: new ObjectId(resolvedParams.id) });
    
    if (blogDoc) {
      blog = {
        ...blogDoc,
        id: blogDoc._id.toString()
      };
    }
  } catch (err) {
    console.error("Failed to fetch single blog", err);
  }

  if (!blog) {
    notFound(); // Show Next.js 404 page if blog is missing
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      {/* Back Button */}
      <Link href="/blog" className="inline-flex items-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Blogs
      </Link>
      
      {/* Blog Image */}
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-auto max-h-[500px] object-cover rounded-2xl mb-10"
        />
      )}
      
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
        {blog.title}
      </h1>
      
      {/* Metadata */}
      <div className="flex items-center gap-4 mb-10 pb-10 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <img
            src={blog.logo || "/logo.png"}
            alt="logo"
            className="w-10 h-10 rounded-full bg-transparent object-contain"
          />
          <div>
            <p className="text-zinc-900 dark:text-white font-medium">{blog.authorName || "My Portfolio"}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{blog.date}</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div 
        className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg [&_*]:!bg-transparent [&_*]:!text-zinc-700 dark:[&_*]:!text-white"
        dangerouslySetInnerHTML={{ __html: blog.desc }}
      />
    </div>
  );
}
