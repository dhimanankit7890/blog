"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import 'quill/dist/quill.snow.css';

import Editor from "@/components/Editor";

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", image: "", desc: "", date: "", logo: "", authorName: "" });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => setBlogs(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch blogs", err));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const res = await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          const updatedBlogs = blogs.filter((blog) => String(blog.id) !== String(id));
          setBlogs(updatedBlogs);
        } else {
          alert("Failed to delete blog");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while deleting");
      }
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setIsAddingNew(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingBlog, id: editingBlog.id || editingBlog._id })
      });
      if (res.ok) {
        const updatedBlogs = blogs.map((blog) => 
          String(blog.id) === String(editingBlog.id) ? editingBlog : blog
        );
        setBlogs(updatedBlogs);
        setEditingBlog(null);
      } else {
        alert("Failed to update blog");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating");
    }
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditingBlog({ ...editingBlog, [name]: value });
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingBlog(null);
    
    // Auto-generate today's date so they don't have to type it every time, but they can edit it
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = new Date().toLocaleDateString('en-US', dateOptions);

    setNewBlog({ title: "", image: "", desc: "", date: dateString, logo: "/logo.png", authorName: "My Portfolio" });
  };

  const handleSaveNew = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog)
      });
      
      if (res.ok) {
        const data = await res.json();
        const blogToAdd = {
          ...newBlog,
          id: data.id,
        };
        const updatedBlogs = [blogToAdd, ...blogs]; // Add to the top of the list
        setBlogs(updatedBlogs);
        setIsAddingNew(false);
        setNewBlog({ title: "", image: "", desc: "", date: "", logo: "", authorName: "" }); // Reset form
      } else {
        alert("Failed to create blog");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating");
    }
  };

  const handleChangeNew = (e) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  // Generic file upload handler
  const handleFileUpload = (e, isEditing, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditing) {
          setEditingBlog((prev) => ({ ...prev, [fieldName]: reader.result }));
        } else {
          setNewBlog((prev) => ({ ...prev, [fieldName]: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isClient) return null; // Avoid hydration matching errors

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">Blog Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold shadow transition"
          >
            + Add New Blog
          </button>
          <Link href="/blog" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium transition">
            View Live Blogs &rarr;
          </Link>
        </div>
      </div>

      {/* Add New Blog Form */}
      {isAddingNew && (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-10 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-4">Create New Blog</h2>
          <form onSubmit={handleSaveNew} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Title</label>
              <input 
                type="text" 
                name="title"
                value={newBlog.title} 
                onChange={handleChangeNew}
                placeholder="Enter blog title"
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 outline-none focus:border-blue-500 transition"
                required
              />
            </div>
            
            {/* File Upload for Main Image */}
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Main Image (Upload)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileUpload(e, false, 'image')}
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 outline-none focus:border-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
              {newBlog.image && (
                <div className="mt-3">
                  <span className="text-xs text-zinc-500 mb-1 block">Preview:</span>
                  <img src={newBlog.image} alt="Blog Preview" className="h-24 w-auto rounded-lg object-cover border border-zinc-300 dark:border-zinc-700" />
                </div>
              )}
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Author Name</label>
              <input 
                type="text" 
                name="authorName"
                value={newBlog.authorName} 
                onChange={handleChangeNew}
                placeholder="My Portfolio"
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* File Upload for Author Logo */}
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Author Logo (Upload)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileUpload(e, false, 'logo')}
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 outline-none focus:border-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
              {newBlog.logo && (
                <div className="mt-3">
                  <span className="text-xs text-zinc-500 mb-1 block">Preview:</span>
                  <img src={newBlog.logo} alt="Logo Preview" className="h-12 w-12 rounded-full object-cover border border-zinc-300 dark:border-zinc-700" />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Publish Date</label>
              <input 
                type="text" 
                name="date"
                value={newBlog.date} 
                onChange={handleChangeNew}
                placeholder="March 12, 2026"
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 outline-none focus:border-blue-500 transition"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Description / Content</label>
              <Editor 
                value={newBlog.desc} 
                onChange={(val) => setNewBlog(prev => ({ ...prev, desc: val }))} 
              />
            </div>
            <div className="md:col-span-2 flex gap-4 mt-2">
              <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-lg font-semibold transition">
                Publish Blog
              </button>
              <button type="button" onClick={() => setIsAddingNew(false)} className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white px-6 py-2.5 rounded-lg font-semibold transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {editingBlog && (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-10 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-4">Edit Blog</h2>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Title</label>
              <input 
                type="text" 
                name="title"
                value={editingBlog.title} 
                onChange={handleChangeEdit}
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 outline-none focus:border-blue-500 transition"
                required
              />
            </div>

            {/* File Upload for Main Image Edit */}
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Main Image (Upload New)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileUpload(e, true, 'image')}
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 outline-none focus:border-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
              {editingBlog.image && (
                <div className="mt-3">
                  <span className="text-xs text-zinc-500 mb-1 block">Current Image:</span>
                  <img src={editingBlog.image} alt="Blog Preview" className="h-24 w-auto rounded-lg object-cover border border-zinc-300 dark:border-zinc-700" />
                </div>
              )}
            </div>

            {/* Author Name (Edit) */}
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Author Name</label>
              <input 
                type="text" 
                name="authorName"
                value={editingBlog.authorName || ''} 
                onChange={handleChangeEdit}
                placeholder="My Portfolio"
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* File Upload for Author Logo Edit */}
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Author Logo (Upload New)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileUpload(e, true, 'logo')}
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 outline-none focus:border-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
              {editingBlog.logo && (
                <div className="mt-3">
                  <span className="text-xs text-zinc-500 mb-1 block">Current Logo:</span>
                  <img src={editingBlog.logo} alt="Logo Preview" className="h-12 w-12 rounded-full object-cover border border-zinc-300 dark:border-zinc-700" />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Publish Date</label>
              <input 
                type="text" 
                name="date"
                value={editingBlog.date || ''} 
                onChange={handleChangeEdit}
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 outline-none focus:border-blue-500 transition"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Description</label>
              <Editor 
                value={editingBlog.desc} 
                onChange={(val) => setEditingBlog(prev => ({ ...prev, desc: val }))} 
              />
            </div>
            <div className="md:col-span-2 flex gap-4 mt-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold transition">
                Save Changes
              </button>
              <button type="button" onClick={() => setEditingBlog(null)} className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white px-6 py-2.5 rounded-lg font-semibold transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
        <table className="w-full text-left">
          <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">
            <tr>
              <th className="p-5 font-semibold">Blog Title & Overview</th>
              <th className="p-5 font-semibold w-40">Date</th>
              <th className="p-5 font-semibold text-right w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {blogs.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-10 text-center text-zinc-500 text-lg">
                  No blogs found. Click "+ Add New Blog" to create one!
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition group">
                  <td className="p-5 align-top">
                    <div className="font-semibold text-zinc-900 dark:text-white text-lg mb-1">{blog.title}</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 pr-10" dangerouslySetInnerHTML={{ __html: blog.desc.substring(0, 150) + (blog.desc.length > 150 ? '...' : '') }}></div>
                  </td>
                  <td className="p-5 align-top text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                    {blog.date}
                  </td>
                  <td className="p-5 align-top text-right whitespace-nowrap">
                    <button 
                      onClick={() => handleEdit(blog)}
                      className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium mr-4 transition bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-1.5 rounded"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-3 py-1.5 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}