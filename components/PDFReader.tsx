"use client";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Usar worker local (copiado de node_modules a public/)
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface Props {
  currentPage: number;
  totalPages: number;
  onTotalPages: (n: number) => void;
  onPageChange: (n: number) => void;
}

export default function PDFReader({ currentPage, totalPages, onTotalPages, onPageChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 32);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full min-h-screen">
      {/* Controles */}
      <div className="sticky top-0 z-20 w-full bg-[#0d0d1a]/90 backdrop-blur border-b border-white/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-sm transition-colors"
          >
            ←
          </button>
          <span className="text-sm text-gray-400">
            Página <strong className="text-white">{currentPage}</strong>
            {totalPages > 0 && <> de <strong className="text-white">{totalPages}</strong></>}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-sm transition-colors"
          >
            →
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
            className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition-colors"
          >
            −
          </button>
          <span className="text-xs text-gray-400 w-10 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.min(2, s + 0.1))}
            className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-sm transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* PDF */}
      <div className="py-6 px-4 w-full flex justify-center">
        <Document
          file="/book.pdf"
          onLoadSuccess={({ numPages }) => onTotalPages(numPages)}
          loading={
            <div className="flex items-center justify-center h-96 text-gray-500">
              <div className="text-center space-y-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent mx-auto" />
                <p>Cargando PDF…</p>
              </div>
            </div>
          }
          error={
            <div className="text-center py-20 space-y-3 text-gray-500">
              <p className="text-4xl">📄</p>
              <p>No se encontró el PDF.</p>
              <p className="text-sm">Colocá <code className="text-accent">book.pdf</code> en la carpeta <code className="text-accent">public/</code></p>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            width={Math.min(containerWidth, 900) * scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-2xl shadow-black/50 rounded-sm"
          />
        </Document>
      </div>

      {/* Navegación inferior */}
      <div className="pb-10 flex items-center gap-4">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-sm transition-colors"
        >
          ← Anterior
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="px-5 py-2 rounded-xl bg-accent hover:bg-red-600 disabled:opacity-30 text-sm transition-colors text-white font-medium"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
