import React from "react";
import { FeedItem } from "../../types";

interface RankingCardProps {
  item: FeedItem;
  onOpenCluster: () => void;
}

export const RankingCard: React.FC<RankingCardProps> = ({ item, onOpenCluster }) => {
  const date = new Date(item.timestamp);

  return (
    <button
      onClick={onOpenCluster}
      className="w-full text-left glass-panel card-hover rounded-2xl p-4 sm:p-5 flex gap-4"
    >
      <div className="flex flex-col items-center justify-between">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-b from-accent.blue to-accent.purple text-base font-semibold text-white shadow-soft">
          {item.rank}
        </span>
        <span className="mt-3 inline-flex rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-slate-400">
          {item.category}
        </span>
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-start gap-2">
          <h2 className="flex-1 text-sm sm:text-base font-semibold text-slate-50">
            {item.title}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">
          {item.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {item.sourceCount} sources
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5">
            ★ <span className="font-medium text-slate-200">{item.score}</span>
          </span>
          <span className="ml-auto text-[11px] text-slate-500">
            {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} •{" "}
            {date.toLocaleDateString()}
          </span>
        </div>
      </div>
    </button>
  );
};




