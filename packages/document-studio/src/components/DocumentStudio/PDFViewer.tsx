import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { FileItem } from './types';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  file: FileItem;
}

export function PDFViewer({ file }: Props) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  return (
    <div className="flex flex-col h-full bg-[#14161B] overflow-hidden">
      {/* Viewer Toolbar */}
      <div className="h-10 bg-[#0F1117] border-b border-white/10 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-black/40 rounded p-1 border border-white/5 gap-1">
            <button 
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="p-1 rounded hover:bg-slate-700 disabled:opacity-50 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <span className="px-2 py-0.5 text-xs text-slate-300 min-w-[3rem] text-center">
              {pageNumber} / {numPages || '-'}
            </span>
            <button 
              onClick={() => setPageNumber(p => Math.min(numPages || p, p + 1))}
              disabled={pageNumber >= (numPages || 1)}
              className="p-1 rounded hover:bg-slate-700 disabled:opacity-50 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] text-slate-500">Zoom: {Math.round(scale * 100)}%</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setScale(s => Math.min(3, s + 0.2))}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Container */}
      <div className="flex-1 overflow-auto p-4 flex justify-center bg-[#14161B] relative custom-scrollbar">
        <Document
          file={file.url}
          onLoadSuccess={onDocumentLoadSuccess}
          className="shadow-2xl"
          loading={
            <div className="flex items-center justify-center h-full w-full absolute inset-0">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-full w-full absolute inset-0 text-red-400 text-sm">
              Failed to load PDF file.
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="bg-white transition-transform duration-200 origin-top shadow-xl"
          />
        </Document>
      </div>
    </div>
  );
}
