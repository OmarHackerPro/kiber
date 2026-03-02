import React from "react";
import { TimeFilter, SortBy } from "../../types";
import { DarkModeToggle } from "../shared/DarkModeToggle";

interface TopBarProps {
  timeFilter: TimeFilter;
  onTimeFilterChange: (value: TimeFilter) => void;
  sortBy: SortBy;
  onSortByChange: (value: SortBy) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  timeFilter,
  onTimeFilterChange,
  sortBy,
  onSortByChange,
  category,
  onCategoryChange,
  search,
  onSearchChange
}) => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/70 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-accent.blue to-accent.purple flex items-center justify-center shadow-soft">
            <span className="text-xs font-semibold text-white">FE</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-[0.18em]">
              Feed explorer
            </p>
            <p className="text-xs text-slate-500 hidden sm:block">
              Ranked news clusters across the AI ecosystem
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-wrap items-center justify-end gap-3 text-xs sm:text-[13px]">
          <div className="hidden md:flex items-center gap-1 rounded-full bg-slate-900/80 px-1.5 py-1 border border-slate-800/80">
            {[
              { id: "1h", label: "Last hour" },
              { id: "24h", label: "24h" },
              { id: "7d", label: "7d" },
              { id: "30d", label: "30d" },
              { id: "all", label: "All" }
            ].map(option => (
              <button
                key={option.id}
                onClick={() => onTimeFilterChange(option.id as TimeFilter)}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  timeFilter === option.id
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-md flex-1">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                ⌕
              </span>
              <input
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search clusters, topics, publishers…"
                className="w-full rounded-xl border border-slate-800/80 bg-slate-900/70 pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-accent.blue/70 focus:border-accent.blue/70"
              />
            </div>

            <select
              value={category}
              onChange={e => onCategoryChange(e.target.value)}
              className="hidden sm:block rounded-xl border border-slate-800/80 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-700"
            >
              <option value="">All categories</option>
              <option value="AI">AI</option>
              <option value="Semiconductors">Semiconductors</option>
              <option value="Policy">Policy</option>
            </select>

            <select
              value={sortBy}
              onChange={e => onSortByChange(e.target.value as SortBy)}
              className="rounded-xl border border-slate-800/80 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-700"
            >
              <option value="score">Score</option>
              <option value="latest">Latest</option>
              <option value="sources">Most sources</option>
            </select>
          </div>

          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
};




