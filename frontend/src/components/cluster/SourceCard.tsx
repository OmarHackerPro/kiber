import React from "react";
import { ClusterSource } from "../../types";

interface SourceCardProps {
  source: ClusterSource;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  const date = new Date(source.timestamp);

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      className="block glass-panel card-hover rounded-2xl p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium text-accent.blue mb-1">
            {source.publisher}
          </p>
          <h3 className="text-sm sm:text-base font-semibold text-slate-50">
            {source.title}
          </h3>
        </div>
        <span className="text-[11px] text-slate-500">
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} •{" "}
          {date.toLocaleDateString()}
        </span>
      </div>
    </a>
  );
};




