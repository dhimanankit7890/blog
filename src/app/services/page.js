export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-[80vh]">
      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="p-8 border border-zinc-800 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors">
            <h3 className="text-2xl font-semibold mb-4">Service {item}</h3>
            <p className="text-zinc-400">
              Description for service {item}. Base code without data.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
