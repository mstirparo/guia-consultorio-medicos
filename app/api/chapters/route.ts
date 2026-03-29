import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";

export interface Chapter {
  title: string;
  page: number;
  level: number;
}

async function extractChaptersFromPDF(buffer: Buffer): Promise<Chapter[]> {
  try {
    // Importar pdfjs en modo legacy (compatible con Node.js)
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs" as string);
    const pdfLib = (pdfjsLib as { default?: typeof pdfjsLib } & typeof pdfjsLib).default ?? pdfjsLib;

    if (pdfLib.GlobalWorkerOptions) {
      pdfLib.GlobalWorkerOptions.workerSrc = "";
    }

    const loadingTask = pdfLib.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;

    // 1. Intentar obtener el índice (outline/bookmarks) del PDF
    const outline = await pdf.getOutline();
    if (outline && outline.length > 0) {
      const chapters: Chapter[] = [];
      for (const item of outline) {
        if (item.dest) {
          const destArray = Array.isArray(item.dest) ? item.dest : await pdf.getDestination(item.dest as string);
          if (destArray && destArray[0]) {
            const pageIndex = await pdf.getPageIndex(destArray[0]);
            chapters.push({ title: item.title, page: pageIndex + 1, level: 0 });
          }
        }
      }
      if (chapters.length > 0) return chapters;
    }

    // 2. Fallback: escanear texto buscando patrones de capítulos
    const chapters: Chapter[] = [];
    const totalPages = pdf.numPages;
    const patterns = [
      /^(CAPÍTULO|CAPITULO|Capítulo|Capitulo|CHAPTER|Chapter)\s+(\d+|[IVXLCDM]+)/,
      /^(PARTE|PART|Parte|Part)\s+(\d+|[IVXLCDM]+)/,
      /^(\d+)\.\s+[A-ZÁÉÍÓÚ]/,
    ];

    for (let pageNum = 1; pageNum <= Math.min(totalPages, 300); pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const lines = textContent.items
        .map((item: { str?: string }) => item.str ?? "")
        .join(" ")
        .split("\n")
        .map((l: string) => l.trim())
        .filter(Boolean);

      for (const line of lines.slice(0, 5)) {
        for (const pattern of patterns) {
          if (pattern.test(line) && line.length < 80) {
            chapters.push({ title: line, page: pageNum, level: 0 });
            break;
          }
        }
      }
    }

    return chapters;
  } catch (err) {
    console.error("Error extrayendo capítulos:", err);
    return [];
  }
}

export async function GET() {
  try {
    const pdfPath = path.join(process.cwd(), "public", "book.pdf");
    const buffer = await readFile(pdfPath);
    const chapters = await extractChaptersFromPDF(buffer);
    return NextResponse.json({ chapters, total: chapters.length });
  } catch {
    return NextResponse.json(
      { chapters: [], total: 0, error: "No se encontró el PDF. Colocá book.pdf en la carpeta /public." },
      { status: 404 }
    );
  }
}
