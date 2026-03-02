import React from "react";

interface SidebarProps {
  onNavigateToFeed: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigateToFeed }) => {
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 space-y-4">
      <div className="glass-panel rounded-2xl p-4">
        <button
          onClick={onNavigateToFeed}
          className="w-full inline-flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-100 bg-slate-800/70 hover:bg-slate-700/80 transition-colors"
        >
          <span>Home Feed</span>
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[10px]">
            ⌂
          </span>
        </button>
      </div>
      <div className="glass-panel rounded-2xl p-4 space-y-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Navigation
        </p>
        <nav className="space-y-1 text-sm text-slate-300">
          <button className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800/70">
            Trending clusters
          </button>
          <button className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800/70">
            Saved views
          </button>
          <button className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800/70">
            Alerts
          </button>
        </nav>
      </div>
    </aside>
  );
};




