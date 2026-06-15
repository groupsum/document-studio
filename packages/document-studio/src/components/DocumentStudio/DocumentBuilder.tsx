import { useRef, useState, useEffect } from 'react';
import { DocumentState, FormFieldType } from './types';
import { CodeEditor } from './CodeEditor';
import { SignaturePad } from './SignaturePad';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FileIcon, Download, Plus, Trash2, Code2, LayoutTemplate, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  state: DocumentState;
  updateCode: (code: string) => void;
  setLanguage: (lang: string) => void;
  addField: (type: FormFieldType) => void;
  updateField: (id: string, updates: any) => void;
  removeField: (id: string) => void;
  theme?: 'light' | 'dark' | 'system';
}

function DraggableField({ field, scale, onUpdate }: { field: import('./types').FormField, scale: number, onUpdate: (id: string, updates: Partial<import('./types').FormField>) => void }) {
  const handleDragStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = field.x;
    const initialY = field.y;

    const handleMove = (moveEvent: PointerEvent) => {
      const dx = (moveEvent.clientX - startX) / scale;
      const dy = (moveEvent.clientY - startY) / scale;
      onUpdate(field.id, { x: Math.round(initialX + dx), y: Math.round(initialY + dy) });
    };

    const handleUp = () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
  };

  const handleResizeStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = field.width;
    const initialHeight = field.height;

    const handleMove = (moveEvent: PointerEvent) => {
      const dx = (moveEvent.clientX - startX) / scale;
      const dy = (moveEvent.clientY - startY) / scale;
      onUpdate(field.id, { 
        width: Math.max(20, Math.round(initialWidth + dx)), 
        height: Math.max(20, Math.round(initialHeight + dy)) 
      });
    };

    const handleUp = () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
  };

  return (
    <div
      className="absolute border border-indigo-500/30 hover:border-indigo-500 focus-within:border-indigo-500 bg-indigo-500/5 flex flex-col shadow-sm group"
      style={{ left: field.x, top: field.y, width: field.width, height: field.height }}
    >
      {/* Top Label Bar (Drag Handle) */}
      <div 
        className="bg-indigo-500 text-white text-[9px] font-bold uppercase px-1 py-0.5 flex items-center justify-between shrink-0 cursor-move"
        onPointerDown={handleDragStart}
      >
        <span className="truncate select-none pointer-events-none">{field.label}</span>
      </div>
      
      {/* Value Area */}
      <div 
        className={cn("flex-1 p-1 text-xs text-indigo-900 bg-white/60 overflow-hidden flex items-start relative select-none", field.readonly && "opacity-70 bg-gray-200/50")}
        style={{ fontSize: field.fontSize ? `${field.fontSize}px` : undefined }}
      >
        {field.type === 'signature' ? (
          field.value ? <img src={field.value} className="w-full h-full object-contain mix-blend-multiply pointer-events-none" /> : <span className="text-[10px] text-indigo-400 italic pointer-events-none">{field.placeholder || 'Signature'}</span>
        ) : field.type === 'checkbox' ? (
          <fieldset className="flex flex-col gap-1 w-full h-full pointer-events-none p-0 m-0 border-none" aria-label={field.groupName || field.label}>
            {field.groupName && <legend className="text-[10px] font-bold text-indigo-900 truncate mb-0.5">{field.groupName}</legend>}
            {field.options?.map((opt: string, i: number) => (
              <div key={i} className="flex items-center gap-1">
                <div className="flex items-center justify-center w-3 h-3 border border-indigo-500 rounded-sm shrink-0">
                  {field.checkedOptions?.includes(opt) && (
                    <svg className="w-2.5 h-2.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[10px] text-indigo-900 truncate">{opt}</span>
              </div>
            ))}
            {/* If no options, render single checkbox */}
            {(!field.options || field.options.length === 0) && (
              <div className="flex items-center justify-center w-full h-full">
                <div className={cn("w-4 h-4 border-2 border-indigo-500 rounded-sm", field.checked ? "bg-indigo-500 relative" : "")}>
                  {field.checked && (
                    <svg className="absolute inset-0 w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </fieldset>
        ) : field.type === 'radio' ? (
          <fieldset className="flex flex-col gap-1 w-full h-full pointer-events-none p-0 m-0 border-none" aria-label={field.groupName || field.label}>
            {field.groupName && <legend className="text-[10px] font-bold text-indigo-900 truncate mb-0.5">{field.groupName}</legend>}
            {field.options?.map((opt: string, i: number) => (
              <div key={i} className="flex items-center gap-1">
                <div className="flex items-center justify-center w-3 h-3 border border-indigo-500 rounded-full shrink-0">
                  {field.value === opt && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                </div>
                <span className="text-[10px] text-indigo-900 truncate">{opt}</span>
              </div>
            ))}
          </fieldset>
        ) : field.type === 'password' ? (
          <div className="w-full h-full break-all whitespace-pre-wrap pointer-events-none text-[inherit]">{field.value ? '••••••••' : <span className="text-indigo-400 italic opacity-60 text-[10px]">{field.placeholder || 'Empty'}</span>}</div>
        ) : (
          <div className="w-full h-full break-all whitespace-pre-wrap pointer-events-none text-[inherit]">{field.value || <span className="text-indigo-400 italic opacity-60 text-[10px]">{field.placeholder || 'Empty'}</span>}</div>
        )}
      </div>

      {/* Resize Handle */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onPointerDown={handleResizeStart}
      >
        <div style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} className="w-full h-full bg-indigo-500" />
      </div>
    </div>
  );
}

export function DocumentBuilder({
  state,
  updateCode,
  setLanguage,
  addField,
  updateField,
  removeField,
  theme = 'light'
}: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Base width is 800 + some padding (e.g., 64px total)
        const availableWidth = entry.contentRect.width - 64; 
        const availableHeight = entry.contentRect.height - 64;
        
        // We want to fit 800px width and ~1131px height
        const scaleW = availableWidth / 800;
        const scaleH = availableHeight / 1131;
        
        // Always fit entirely inside if it's too big, up to a max of 1.0 (or fit screen)
        const idealScale = Math.max(0.3, Math.min(1.2, Math.min(scaleW, scaleH)));
        
        // We ensure we don't spam updates unnecessarily to avoid jitter
        setScale(prev => Math.abs(prev - idealScale) > 0.05 ? Number(idealScale.toFixed(2)) : prev);
      }
    });
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  const handleExport = async () => {
    if (!previewRef.current) return;
    
    // Scale temporarily to 1 for export to avoid distortion, though html2canvas might handle it.
    // It's safer to just let it capture the scaled dom or unscale temporarily.
    // Actually, setting window scale back is hard synchronously. 
    // We'll rely on html2canvas scale.
    const canvas = await html2canvas(previewRef.current, {
      scale: 2 / scale, // Compensate for visual scaling
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width / 2, canvas.height / 2]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save('Exported-Document.pdf');
  };

  return (
    <div className="flex h-full w-full bg-[#14161B] overflow-hidden">
      
      {/* Central Canvas: Live Preview */}
      <section className="flex-1 flex flex-col relative" role="region" aria-label="Document Live Preview Canvas">
        <div className="h-10 bg-[#0F1117] border-b border-white/10 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileIcon className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <h2 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Live Preview</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-mono">{Math.round(scale * 100)}%</span>
              <button 
                onClick={() => setScale(s => Math.max(0.2, s - 0.1))}
                className="p-1 text-slate-400 hover:text-white transition-colors outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setScale(s => Math.min(3, s + 0.1))}
                className="p-1 text-slate-400 hover:text-white transition-colors outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded shadow-lg shadow-indigo-900/20 transition-all uppercase outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0F1117]"
              aria-label="Export document as PDF"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              Export
            </button>
          </div>
        </div>

        <div 
          ref={containerRef}
          className="flex-1 overflow-auto p-4 md:p-8 relative flex justify-center custom-scrollbar"
        >
          {/* Document Canvas Wrapper: defines layout space based on scale */}
          <div 
            style={{ width: 800 * scale, height: 1131 * scale }} 
            className="shrink-0 relative transition-all"
          >
            {/* Actual scaled inner canvas */}
            <div 
              ref={previewRef}
              className="w-[800px] min-h-[1131px] bg-white text-black p-8 md:p-12 rounded shadow-2xl origin-top-left absolute left-0 top-0 transition-transform"
              style={{ transform: `scale(${scale})` }}
            >
            <div className="flex flex-col h-full">
              <header className="border-b-2 border-slate-200 pb-6 mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Generated Document</h1>
                <p className="text-sm text-slate-500 mt-2">Generated on {new Date().toLocaleDateString()}</p>
              </header>
              
              <div className="flex-1 space-y-8">
                {/* Code Block */}
                {state.codeContent && (
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-slate-800">Content Output ({state.language})</h2>
                    <pre className="p-4 bg-slate-50 rounded-lg border border-slate-200 overflow-x-auto text-sm font-mono text-slate-800 whitespace-pre-wrap word-break">
                      {state.codeContent}
                    </pre>
                  </div>
                )}

                {/* Fields - Absolute Overlay */}
                {state.fields.map(field => (
                  <DraggableField
                    key={field.id}
                    field={field}
                    scale={scale}
                    onUpdate={updateField}
                  />
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Right Sidebar: Properties & Tools */}
      <aside className="w-80 border-l border-white/10 bg-[#0F1117] flex flex-col overflow-y-auto custom-scrollbar" role="complementary" aria-label="Field and Document Properties">
        <div className="p-4 flex flex-col gap-6">
          
          {/* Syntax Editor Section */}
          <div className="flex flex-col gap-3 min-h-[300px]" role="group" aria-label="Code Editor">
            <div className="flex items-center justify-between">
              <p id="code-content-heading" className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                Code Content
              </p>
              <select
                aria-labelledby="code-content-heading"
                aria-label="Select syntax highlighting language"
                value={state.language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-2 py-1 text-[10px] border border-white/10 rounded bg-black/30 text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 appearance-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="json">JSON</option>
                <option value="markdown">Markdown</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
            </div>
            {/* Wrapper to handle CodeEditor in dark mode accurately style-wise */}
            <div className="flex-1 min-h-[200px] border border-white/10 rounded overflow-hidden">
              <CodeEditor 
                code={state.codeContent} 
                language={state.language} 
                onChange={(v) => updateCode(v || '')}
                theme="dark"
              />
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="flex flex-col gap-3" role="group" aria-label="Form Fields Configuration">
            <div className="flex items-center justify-between border-t border-white/5 pt-6 mb-2">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <LayoutTemplate className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                Field Properties
              </p>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2" role="toolbar" aria-label="Add new field tools">
              <button onClick={() => addField('label')} aria-label="Add Label Field" className="px-2 py-1 text-[9px] font-bold bg-white/5 text-slate-400 rounded hover:bg-white/10 uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">+ Label</button>
              <button onClick={() => addField('text')} aria-label="Add Text Field" className="px-2 py-1 text-[9px] font-bold bg-white/5 text-slate-400 rounded hover:bg-white/10 uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">+ Text</button>
              <button onClick={() => addField('textarea')} aria-label="Add Textarea Field" className="px-2 py-1 text-[9px] font-bold bg-white/5 text-slate-400 rounded hover:bg-white/10 uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">+ Textarea</button>
              <button onClick={() => addField('password')} aria-label="Add Password Field" className="px-2 py-1 text-[9px] font-bold bg-white/5 text-slate-400 rounded hover:bg-white/10 uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">+ Password</button>
              <button onClick={() => addField('date')} aria-label="Add Date Field" className="px-2 py-1 text-[9px] font-bold bg-white/5 text-slate-400 rounded hover:bg-white/10 uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">+ Date</button>
              <button onClick={() => addField('checkbox')} aria-label="Add Checkbox Field" className="px-2 py-1 text-[9px] font-bold bg-white/5 text-slate-400 rounded hover:bg-white/10 uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">+ Checkbox</button>
              <button onClick={() => addField('radio')} aria-label="Add Radio Field" className="px-2 py-1 text-[9px] font-bold bg-white/5 text-slate-400 rounded hover:bg-white/10 uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">+ Radio</button>
              <button onClick={() => addField('select')} aria-label="Add Select Field" className="px-2 py-1 text-[9px] font-bold bg-white/5 text-slate-400 rounded hover:bg-white/10 uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">+ Select</button>
              <button onClick={() => addField('signature')} aria-label="Add Signature Field" className="px-2 py-1 text-[9px] font-bold bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/30 uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">+ Signature</button>
            </div>
            
            <div className="flex flex-col gap-3">
              {state.fields.length === 0 && (
                <p className="text-[10px] text-slate-500 italic px-1">No custom fields added. Use the buttons above.</p>
              )}
              {state.fields.map((field) => (
                <div key={field.id} className="flex flex-col gap-3 p-3 bg-white/5 border border-white/10 rounded shadow-sm relative group focus-within:ring-1 focus-within:ring-white/20">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      aria-label="Field Label"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      className="text-[10px] font-bold bg-transparent border-b border-transparent outline-none focus-visible:border-indigo-500 text-slate-300 placeholder-slate-500 uppercase"
                      placeholder="Field Label"
                    />
                    <button onClick={() => removeField(field.id)} aria-label={`Remove field ${field.label}`} className="p-0.5 text-slate-500 hover:text-red-400 transition-colors outline-none focus-visible:text-red-400 focus-visible:ring-2 focus-visible:ring-red-400 rounded">
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Coordinates configuration */}
                  <div className="grid grid-cols-4 gap-2 mb-2" role="group" aria-label="Field Boundaries">
                    <div className="flex flex-col gap-1">
                      <label htmlFor={`pos-x-${field.id}`} className="text-[8px] text-slate-500 uppercase font-semibold">X (px)</label>
                      <input id={`pos-x-${field.id}`} type="number" aria-label={`${field.label} X Position`} value={field.x} onChange={(e) => updateField(field.id, { x: Number(e.target.value) })} className="w-full bg-black/30 border border-white/10 rounded px-1.5 py-1 text-xs text-white outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor={`pos-y-${field.id}`} className="text-[8px] text-slate-500 uppercase font-semibold">Y (px)</label>
                      <input id={`pos-y-${field.id}`} type="number" aria-label={`${field.label} Y Position`} value={field.y} onChange={(e) => updateField(field.id, { y: Number(e.target.value) })} className="w-full bg-black/30 border border-white/10 rounded px-1.5 py-1 text-xs text-white outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor={`pos-w-${field.id}`} className="text-[8px] text-slate-500 uppercase font-semibold">W (px)</label>
                      <input id={`pos-w-${field.id}`} type="number" min="1" aria-label={`${field.label} Width`} value={field.width} onChange={(e) => updateField(field.id, { width: Number(e.target.value) })} className="w-full bg-black/30 border border-white/10 rounded px-1.5 py-1 text-xs text-white outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor={`pos-h-${field.id}`} className="text-[8px] text-slate-500 uppercase font-semibold">H (px)</label>
                      <input id={`pos-h-${field.id}`} type="number" min="1" aria-label={`${field.label} Height`} value={field.height} onChange={(e) => updateField(field.id, { height: Number(e.target.value) })} className="w-full bg-black/30 border border-white/10 rounded px-1.5 py-1 text-xs text-white outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500" />
                    </div>
                  </div>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      aria-label={`${field.label} Value Input`}
                      value={field.value}
                      onChange={(e) => updateField(field.id, { value: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  )}
                  {field.type === 'password' && (
                    <input
                      type="password"
                      aria-label={`${field.label} Password Input`}
                      value={field.value}
                      onChange={(e) => updateField(field.id, { value: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  )}
                  {field.type === 'checkbox' && (!field.options || field.options.length === 0) && (
                    <label className="flex items-center gap-2 mt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        aria-label={`Toggle ${field.label}`}
                        checked={!!field.checked}
                        onChange={(e) => updateField(field.id, { checked: e.target.checked })}
                        className="rounded bg-black/30 border border-white/10 text-indigo-500 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:ring-offset-0 focus:ring-offset-transparent w-4 h-4"
                      />
                      <span className="text-xs text-slate-300">Checked</span>
                    </label>
                  )}
                  {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        aria-label={`${field.label} Option List`}
                        value={field.options?.join(', ')}
                        onChange={(e) => {
                          const options = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          const updateObj: any = { options: options.length > 0 ? options : undefined };
                          if (field.type === 'checkbox' && field.checkedOptions) {
                              updateObj.checkedOptions = field.checkedOptions.filter(o => options.includes(o));
                          }
                          if (field.type === 'radio' && field.value && !options.includes(field.value)) {
                              updateObj.value = '';
                          }
                          updateField(field.id, updateObj);
                        }}
                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500"
                        placeholder="Options (comma separated)"
                      />
                      {field.type === 'select' ? (
                        <select
                          aria-label={`Select ${field.label}`}
                          value={field.value}
                          onChange={(e) => updateField(field.id, { value: e.target.value })}
                          className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500"
                        >
                          <option value="">Select...</option>
                          {field.options?.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'checkbox' && field.options && field.options.length > 0 ? (
                        <fieldset className="flex flex-col gap-1.5 mt-1 border-none p-0 m-0" aria-label={`${field.label} Checkbox Options`}>
                          <legend className="sr-only">{field.groupName || field.label}</legend>
                          {field.options?.map((opt, i) => {
                            const isChecked = field.checkedOptions?.includes(opt);
                            return (
                              <label key={i} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  aria-label={`Select option ${opt}`}
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const current = field.checkedOptions || [];
                                    const next = e.target.checked 
                                      ? [...current, opt]
                                      : current.filter(o => o !== opt);
                                    updateField(field.id, { checkedOptions: next });
                                  }}
                                  className="rounded bg-black/30 border border-white/10 text-indigo-500 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 w-3.5 h-3.5"
                                />
                                <span className="text-xs text-slate-300">{opt}</span>
                              </label>
                            );
                          })}
                        </fieldset>
                      ) : field.type === 'radio' ? (
                        <fieldset className="flex flex-col gap-1.5 mt-1 border-none p-0 m-0" role="radiogroup" aria-label={`${field.label} Radio Selection`}>
                          <legend className="sr-only">{field.groupName || field.label}</legend>
                          {field.options?.map((opt, i) => (
                            <label key={i} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                aria-label={`Select option ${opt}`}
                                name={`radio-${field.id}`}
                                value={opt}
                                checked={field.value === opt}
                                onChange={(e) => updateField(field.id, { value: e.target.value })}
                                className="bg-black/30 border border-white/10 text-indigo-500 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 w-3.5 h-3.5"
                              />
                              <span className="text-xs text-slate-300">{opt}</span>
                            </label>
                          ))}
                        </fieldset>
                      ) : null}
                    </div>
                  )}
                  {field.type === 'date' && (
                    <input
                      type="date"
                      aria-label={`${field.label} Date Input`}
                      value={field.value}
                      onChange={(e) => updateField(field.id, { value: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500"
                    />
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      aria-label={`${field.label} Textarea Input`}
                      value={field.value}
                      onChange={(e) => updateField(field.id, { value: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500 min-h-[60px] resize-y"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  )}
                  {field.type === 'label' && (
                    <div className="w-full px-2 py-1.5 text-[10px] rounded bg-black/20 text-slate-400 min-h-[28px] italic">
                      {field.value || 'Label text (Display only)'}
                    </div>
                  )}
                  {field.type === 'signature' && (
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Signature Canvas</p>
                      <SignaturePad onSave={(url) => updateField(field.id, { value: url })} initialUrl={field.value} />
                    </div>
                  )}

                  {/* Extended Configuration */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-white/5 mt-1">
                    <div className="flex items-center gap-4">
                      {field.type !== 'label' && (
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.required || false}
                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                            className="rounded bg-black/30 border border-white/10 text-indigo-500 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 w-3.5 h-3.5"
                          />
                          <span className="text-[9px] text-slate-400">Required</span>
                        </label>
                      )}
                      
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.readonly || false}
                          onChange={(e) => updateField(field.id, { readonly: e.target.checked })}
                          className="rounded bg-black/30 border border-white/10 text-indigo-500 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 w-3.5 h-3.5"
                        />
                        <span className="text-[9px] text-slate-400">Read-Only</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                       <div className="flex flex-col gap-1">
                          <label className="text-[8px] text-slate-500 uppercase font-semibold">Font Size</label>
                          <input type="number" min="8" max="72" aria-label="Font Size" value={field.fontSize || ''} onChange={(e) => updateField(field.id, { fontSize: Number(e.target.value) || undefined })} className="w-full bg-black/30 border border-white/10 rounded px-1.5 py-1 text-xs text-white outline-none focus-visible:ring-1 focus-visible:ring-indigo-500" />
                       </div>

                       {(field.type === 'text' || field.type === 'textarea' || field.type === 'password') && (
                         <div className="flex flex-col gap-1">
                            <label className="text-[8px] text-slate-500 uppercase font-semibold">Max Length</label>
                            <input type="number" min="1" aria-label="Max Length" value={field.maxLength || ''} onChange={(e) => updateField(field.id, { maxLength: Number(e.target.value) || undefined })} className="w-full bg-black/30 border border-white/10 rounded px-1.5 py-1 text-xs text-white outline-none focus-visible:ring-1 focus-visible:ring-indigo-500" />
                         </div>
                       )}
                    </div>

                    {(field.type === 'checkbox' || field.type === 'radio') && (
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] text-slate-500 uppercase font-semibold">Fieldset / Group Name</label>
                          <input type="text" aria-label="Group text" value={field.groupName || ''} onChange={(e) => updateField(field.id, { groupName: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded px-1.5 py-1 text-xs text-white outline-none focus-visible:ring-1 focus-visible:ring-indigo-500" placeholder="E.g. question_1" />
                        </div>
                    )}

                    {(field.type === 'text' || field.type === 'textarea' || field.type === 'password' || field.type === 'select' || field.type === 'date') && (
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] text-slate-500 uppercase font-semibold">Placeholder / Default</label>
                          <input type="text" aria-label="Placeholder text" value={field.placeholder || ''} onChange={(e) => updateField(field.id, { placeholder: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded px-1.5 py-1 text-xs text-white outline-none focus-visible:ring-1 focus-visible:ring-indigo-500" placeholder="E.g. Type here..." />
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
