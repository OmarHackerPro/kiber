import React from "react";
import { Cluster } from "../../types";

interface ClusterHeaderProps {
  cluster: Cluster;
  onBack: () => void;
}

export const ClusterHeader: React.FC<ClusterHeaderProps> = ({ cluster, onBack }) => {
  return (
    <div className="sticky top-[3.25rem] z-10 mb-4">
      <div className="glass-panel rounded-2xl px-4 sm:px-5 py-3 border border-slate-800/80">
        <div className="flex flex-wrap items-start gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800/80 transition-colors"
          >
            ← Back to feed
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">
              Cluster detail
            </p>
            <h1 className="text-base sm:text-lg font-semibold text-slate-50 truncate">
              {cluster.title}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-xl bg-slate-900/80 px-2.5 py-1 text-slate-300">
              ★ <span className="font-semibold text-slate-50">{cluster.totalScore}</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-xl bg-slate-900/80 px-2.5 py-1 text-slate-300">
              {cluster.totalSources} sources
            </span>
            <span className="inline-flex items-center gap-1 rounded-xl bg-accent.blue/10 px-2.5 py-1 text-xs text-accent.blue border border-accent.blue/40">
              {cluster.timeRange}
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          {cluster.summary}
        </p>
      </div>
    </div>
  );
};




