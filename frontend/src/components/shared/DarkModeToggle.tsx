import React, { useEffect, useState } from "react";

export const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark(prev => !prev)}
      className="inline-flex items-center gap-1 rounded-full border border-slate-800/80 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 transition-colors"
    >
      <span
        className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] ${
          isDark
            ? "bg-slate-100 text-slate-900"
            : "bg-slate-800 text-slate-100"
        }`}
      >
        {isDark ? "●" : "○"}
      </span>
      <span className="hidden sm:inline">
        {isDark ? "Dark" : "Light"} mode
      </span>
    </button>
  );
};




