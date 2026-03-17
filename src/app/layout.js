import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My Portfolio",
  description: "Creative space",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black text-black dark:text-white min-h-screen flex flex-col transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="border-b border-zinc-200 dark:border-zinc-800 p-4 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-50">
            <nav className="container mx-auto flex items-center justify-between">
              <Link href="/" className="text-xl font-bold tracking-tighter">
                LOGO
              </Link>
              <div className="flex gap-6 items-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                <Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">About</Link>
                <Link href="/services" className="hover:text-black dark:hover:text-white transition-colors">Services</Link>
                <Link href="/blog" className="hover:text-black dark:hover:text-white transition-colors">Blog</Link>
                <ThemeToggle />
              </div>
            </nav>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="border-t border-zinc-200 dark:border-zinc-800 p-8 text-center text-zinc-500 text-sm mt-auto">
            &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
