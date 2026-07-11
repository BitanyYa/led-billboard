"use client";

import { Menu, Bell } from "lucide-react";

interface Props {
  title: string;
  onMenuClick: () => void;
}

export default function AdminTopbar({ title, onMenuClick }: Props) {
  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-heading font-bold text-lg text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <Bell size={18} />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0057D9] to-[#1E73FF] flex items-center justify-center text-white text-xs font-bold">
          A
        </div>
      </div>
    </header>
  );
}
