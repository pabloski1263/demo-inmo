"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { adminFetch } from "@/lib/admin-fetch";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/properties", label: "Propiedades", icon: "🏠" },
  { href: "/admin/content", label: "Contenido", icon: "📝" },
  { href: "/admin/translations", label: "Traducciones", icon: "🌐" },
  { href: "/admin/site", label: "Sitio", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }

    adminFetch("/api/content")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
        }
      })
      .catch(() => router.push("/admin/login"))
      .finally(() => setChecking(false));
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Mobile top bar */}
      <div className="lg:hidden bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <a href="/admin" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-[9px]">IN</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">Admin</span>
        </a>
        <div className="flex items-center gap-3">
          <a href="/" className="text-xs text-gray-400 hover:text-teal-600" target="_blank">Ver sitio</a>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-gray-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block fixed lg:sticky top-0 left-0 z-40 w-56 h-screen bg-white border-r border-gray-100 pt-6`}>
          <div className="px-5 mb-8 hidden lg:block">
            <a href="/admin" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-teal-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">IN</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">Admin</span>
            </a>
          </div>
          <nav className="px-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                    ? "bg-teal-50 text-teal-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-teal-600 px-3"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Ver sitio
            </a>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
