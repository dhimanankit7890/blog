export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[80vh] text-center">
      {/* Hero Section */}
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
        Hero Title
      </h1>
      <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10">
        Hero subtitle describing the primary value proposition in a brief sentence.
      </p>
      
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
          Get Started
        </button>
        <button className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 font-semibold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          Learn More
        </button>
      </div>

      {/* Another generic section if needed below Hero */}
    </div>
  );
}