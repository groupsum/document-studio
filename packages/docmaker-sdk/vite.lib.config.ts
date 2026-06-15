import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'GroupsumDocmakerSDK',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        '@monaco-editor/react',
        'html2canvas',
        'jspdf',
        'lucide-react',
        'motion',
        'pdfjs-dist',
        'react',
        'react-dom',
        'react-pdf',
        'react-signature-canvas',
      ],
      output: {
        globals: {
          '@monaco-editor/react': 'MonacoEditorReact',
          html2canvas: 'html2canvas',
          jspdf: 'jspdf',
          'lucide-react': 'LucideReact',
          motion: 'Motion',
          'pdfjs-dist': 'pdfjsDist',
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-pdf': 'ReactPDF',
          'react-signature-canvas': 'ReactSignatureCanvas',
        },
      },
    },
  },
});
