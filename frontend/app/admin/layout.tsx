"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { createBrowserClient } from "@supabase/ssr";

const PAGE_TITLES: Record<string, string> = {
  "/admin":            "Dashboard",
  "/admin/quotes":     "Quote Requests",
  "/admin/contacts":   "Contact Messages",
  "/admin/packages":   "Packages",
  "/admin/gallery":    "Gallery",
  "/admin/settings":   "Settings",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const isLogin   = pathname === "/admin/login";

  const [checked,     setChecked]     = useState(false);
  const [authed,      setAuthed]      = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLogin) { setChecked(true); return; }

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setAuthed(true);
      } else {
        router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      }
      setChecked(true);
    });
  }, [isLogin, pathname, router]);

  // Login page — no shell
  if (isLogin) return <>{children}</>;

  // Still checking session
  if (!checked) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-[#0057D9]/20 border-t-[#0057D9] animate-spin" />
          <p className="text-gray-400 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  // Not authenticated — render nothing (redirect is already firing)
  if (!authed) return null;

  const title =
    PAGE_TITLES[pathname] ??
    (pathname.includes("/quotes/")   ? "Quote Detail"   :
     pathname.includes("/contacts/") ? "Message Detail" : "Admin");

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
