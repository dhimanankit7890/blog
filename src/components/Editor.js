"use client";

import { useEffect, useRef } from "react";
import 'quill/dist/quill.snow.css';

// Separate Editor Component using native Quill to fix typing issues and add a formatting toolbar
const Editor = ({ value, onChange, placeholder }) => {
  const containerRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && containerRef.current && !quillInstance.current) {
      // Clean up previous toolbar if it exists (fixes double toolbar in React Strict Mode)
      const previousElement = containerRef.current.previousElementSibling;
      if (previousElement && previousElement.classList.contains('ql-toolbar')) {
        previousElement.remove();
      }
      containerRef.current.innerHTML = ""; // Clear existing editor content

      // Dynamically import Quill to avoid Server-Side Rendering (SSR) issues
      import("quill").then((QuillModule) => {
        if (quillInstance.current) return; // Prevent double initialization due to StrictMode race condition
        const Quill = QuillModule.default ? QuillModule.default : QuillModule;
        
        quillInstance.current = new Quill(containerRef.current, {
          theme: "snow",
          placeholder: placeholder || "Write your blog content here...",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],     // toggled buttons
              [{ color: [] }, { background: [] }],           // dropdown with defaults from theme
              [{ list: "ordered" }, { list: "bullet" }],
              [{ align: [] }],
              ["link", "image"],
              ["clean"]                                      // remove formatting button
            ],
          },
        });

        // Set initial value
        if (value) {
          quillInstance.current.clipboard.dangerouslyPasteHTML(value);
        }

        // Listen for user typing
        quillInstance.current.on("text-change", () => {
          onChange(quillInstance.current.root.innerHTML);
        });
      });
    }
  }, []); // Run once on mount

  return (
    <div className="bg-white text-black rounded-lg border border-zinc-300 dark:border-zinc-700 overflow-hidden">
      <div ref={containerRef} className="min-h-[200px]" />
    </div>
  );
};

export default Editor;
