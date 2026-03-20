import Link from "next/link";

export default function BlogCard({ blog }) {
  return (
    <Link
      href={`/blog/${blog.id}`}
      target="_blank"
      className="block bg-zinc-50 dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:scale-[1.02] transition shadow-sm dark:shadow-none cursor-pointer"
    >
      {/* Blog Image */}
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title || "blog"}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          {blog.title}
        </h2>

        {/* Description */}
        <div 
          className="text-zinc-600 dark:text-zinc-300 mt-3 text-sm line-clamp-5 [&>p]:mb-2 [&_*]:!bg-transparent [&_*]:!text-zinc-600 dark:[&_*]:!text-white"
          dangerouslySetInnerHTML={{ __html: blog.desc }}
        />

        {/* Footer Section */}
        <div className="flex items-end justify-between mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <img
              src={blog.logo || "/logo.png"}
              alt="logo"
              className="w-10 h-10 rounded-full object-contain bg-transparent"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {blog.authorName || "My Portfolio"}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {blog.date}
              </span>
            </div>
          </div>

          {/* Read More Link */}
          <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-500 hover:underline transition whitespace-nowrap mb-1">
            Read More &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
