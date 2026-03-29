"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import ChapterSidebar from "@/components/ChapterSidebar";
import { Chapter } from "@/app/api/chapters/route";

// Carga dinámica para evitar errores de SSR con react-pdf
const PDFReader = dynamic(() => import("@/components/PDFReader"), { ssr: false });

export default function ReadPage() {
  const searchParams = useSearchParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [freeChapters, setFreeChapters] = useState(2);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Mostrar mensaje si volvió de Stripe
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setSuccessMsg("✅ ¡Pago exitoso! Ya tenés acceso completo.");
    }
  }, [searchParams]);

  // Cargar capítulos
  useEffect(() => {
    fetch("/api/chapters")
      .then((r) => r.json())
      .then((data) => setChapters(data.chapters ?? []));
  }, []);

  // Verificar acceso
  useEffect(() => {
    fetch("/api/access")
      .then((r) => r.json())
      .then((data) => {
        setHasFullAccess(data.access === "full");
        setFreeChapters(data.freeChapters ?? 2);
      });
  }, []);

  const handleChapterSelect = useCallback((page: number) => {
    setCurrentPage(page);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    // Si no tiene acceso completo, bloquear capítulos de pago
    if (!hasFullAccess && chapters.length > freeChapters) {
      const firstLockedPage = chapters[freeChapters]?.page ?? Infinity;
      if (page >= firstLockedPage) {
        handleBuyClick();
        return;
      }
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [hasFullAccess, chapters, freeChapters]);

  const handleBuyClick = useCallback(async () => {
    setBuyLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Stripe no está configurado aún. Contactá al autor.");
      }
    } catch {
      alert("Error al procesar el pago. Intentá de nuevo.");
    } finally {
      setBuyLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Header onMenuClick={() => setSidebarOpen((o) => !o)} />

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex pt-14">
        {/* Sidebar */}
        <ChapterSidebar
          chapters={chapters}
          currentPage={currentPage}
          freeChapters={freeChapters}
          hasFullAccess={hasFullAccess}
          onSelect={handleChapterSelect}
          onBuyClick={handleBuyClick}
          isOpen={sidebarOpen}
        />

        {/* Contenido */}
        <main className="flex-1 lg:ml-0 min-w-0">
          {successMsg && (
            <div className="m-4 p-4 bg-green-900/30 border border-green-600/50 rounded-xl text-green-400 text-sm">
              {successMsg}
            </div>
          )}

          {buyLoading && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
              <div className="bg-sidebar rounded-2xl p-8 text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
                <p className="text-white">Redirigiendo a Stripe…</p>
              </div>
            </div>
          )}

          <PDFReader
            currentPage={currentPage}
            totalPages={totalPages}
            onTotalPages={setTotalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
}
