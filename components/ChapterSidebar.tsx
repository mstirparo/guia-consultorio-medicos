"use client";
import clsx from "clsx";
import { Chapter } from "@/app/api/chapters/route";

interface Props {
  chapters: Chapter[];
  currentPage: number;
  freeChapters: number;
  hasFullAccess: boolean;
  onSelect: (page: number) => void;
  onBuyClick: () => void;
  isOpen: boolean;
}

export default function ChapterSidebar({
  chapters, currentPage, freeChapters, hasFullAccess, onSelect, onBuyClick, isOpen,
}: Props) {
  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 h-full w-72 bg-sidebar z-30 transform transition-transform duration-300 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:relative lg:z-auto"
      )}
    >
      {/* Header sidebar */}
      <div className="p-5 border-b border-white/10">
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Índice</div>
        <div className="text-white font-bold text-sm leading-tight">Guía de consultorio para médicos clínicos</div>
      </div>

      {/* Lista de capítulos */}
      <nav className="flex-1 overflow-y-auto py-2">
        {chapters.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-500 text-sm">
            Cargando capítulos...
          </div>
        )}
        {chapters.map((ch, i) => {
          const isFree = i < freeChapters;
          const isActive =
            currentPage >= ch.page &&
            (i === chapters.length - 1 || currentPage < chapters[i + 1].page);
          const isLocked = !hasFullAccess && !isFree;

          return (
            <button
              key={i}
              onClick={() => {
                if (isLocked) {
                  onBuyClick();
                } else {
                  onSelect(ch.page);
                }
              }}
              className={clsx(
                "w-full text-left px-5 py-3 text-sm transition-colors duration-150 flex items-center gap-3",
                isActive
                  ? "bg-accent/20 text-accent border-r-2 border-accent"
                  : "text-gray-400 hover:bg-white/5 hover:text-white",
                isLocked && "opacity-50"
              )}
            >
              {isLocked ? (
                <span className="text-xs">🔒</span>
              ) : (
                <span className="text-xs text-gray-600 w-5 shrink-0">{i + 1}</span>
              )}
              <span className="truncate">{ch.title}</span>
              {isFree && !hasFullAccess && (
                <span className="ml-auto text-xs text-green-500 shrink-0">Gratis</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: si no tiene acceso completo */}
      {!hasFullAccess && (
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onBuyClick}
            className="w-full bg-accent text-white font-semibold py-3 px-4 rounded-xl hover:bg-red-600 transition-colors text-sm"
          >
            Desbloquear todo · $9.99
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">Pago único · Sin suscripción</p>
        </div>
      )}
    </aside>
  );
}
