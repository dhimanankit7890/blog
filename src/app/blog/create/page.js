"use client";

import { useState } from "react";

export default function CreateBlog() {

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [logo, setLogo] = useState("");
  const [date, setDate] = useState("");

  const handleUpload = (e, setFunction) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFunction(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBlog = {
      id: Date.now(),
      title,
      desc,
      image,
      logo,
      date
    };

    const oldBlogs =
      JSON.parse(localStorage.getItem("blogs")) || [];

    const updatedBlogs = [...oldBlogs, newBlog];

    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));

    alert("Blog Created 🚀");

    setTitle("");
    setDesc("");
    setImage("");
    setLogo("");
    setDate("");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex justify-center py-16 px-4">

      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-8">

        <h1 className="text-3xl font-bold text-white mb-6">
          Blog Editor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TITLE + IMAGE BUTTON */}
          <div className="flex gap-4 items-center">

            <input
              type="text"
              placeholder="Blog Title"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg cursor-pointer text-sm">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, setImage)}
                className="hidden"
              />
            </label>

          </div>

          {/* IMAGE PREVIEW */}
          {image && (
            <img
              src={image}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          {/* DATE */}
          <input
            type="date"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* DESCRIPTION */}
          <textarea
            rows="5"
            placeholder="Write blog content..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          {/* LOGO UPLOAD */}
          <div>

            <label className="block mb-2 text-zinc-400 text-sm">
              Author Logo
            </label>

            <label className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer text-sm">
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, setLogo)}
                className="hidden"
              />
            </label>

            {logo && (
              <img
                src={logo}
                className="mt-3 w-12 h-12 rounded-full"
              />
            )}

          </div>

          {/* BUTTON */}
          <button className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-zinc-200 transition">
            Publish Blog
          </button>

        </form>

      </div>

    </div>
  );
}