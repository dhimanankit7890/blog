import BlogCard from "@/components/BlogCard";
import clientPromise from "@/lib/mongodb";

export const revalidate = 0; // Force dynamic rendering so new blogs show immediately

export default async function BlogPage() {
  let blogs = [];
  try {
    const client = await clientPromise;
    const db = client.db("blog_db");
    const rawBlogs = await db.collection("blogs").find({}).sort({ _id: -1 }).toArray();
    blogs = rawBlogs.map(blog => ({
      ...blog,
      id: blog._id.toString(),
      _id: blog._id.toString()
    }));
  } catch (err) {
    console.error("Failed to fetch blogs in server component", err);
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-10 text-zinc-900 dark:text-white">
        Latest Blogs
      </h1>

      {blogs.length === 0 ? (
        <div className="text-zinc-500 dark:text-zinc-400">No blogs found.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}