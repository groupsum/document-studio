import { useEffect, useState, useRef } from 'react';
import { PDFHub } from './components/PDFHub';

export default function App() {
  const [logs, setLogs] = useState<{ id: string; time: string; type: string; payload: any }[]>([]);
  const [leftTab, setLeftTab] = useState<'usage' | 'api' | 'log'>('usage');
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleAction = (action: any) => {
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        time: new Date().toLocaleTimeString(),
        type: action.type,
        payload: action.payload,
      }
    ].slice(-50)); // Keep last 50
  };

  useEffect(() => {
    if (leftTab === 'log') {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, leftTab]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#0A0B0E] font-sans text-slate-300 overflow-hidden select-none">
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0F1117] shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center shadow-lg shadow-indigo-900/20">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-wide">React PDF Hub <span className="text-[10px] text-indigo-400 ml-2 border border-indigo-500/20 px-1.5 py-0.5 rounded uppercase font-bold">SDK Showcase</span></h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <a href="#" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.699-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            GitHub
          </a>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Documentation & Logs */}
        <aside className="w-80 border-r border-white/10 bg-[#0F1117] flex flex-col shrink-0 min-h-0">
          <div className="flex border-b border-white/10 shrink-0 bg-black/20">
            <button 
              onClick={() => setLeftTab('usage')}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider text-center transition-colors border-b-2 ${leftTab === 'usage' ? 'border-indigo-500 text-indigo-400 bg-white/5' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              Guide
            </button>
            <button 
              onClick={() => setLeftTab('api')}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider text-center transition-colors border-b-2 ${leftTab === 'api' ? 'border-amber-500 text-amber-500 bg-white/5' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              API Types
            </button>
            <button 
              onClick={() => setLeftTab('log')}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider text-center transition-colors border-b-2 ${leftTab === 'log' ? 'border-emerald-500 text-emerald-400 bg-white/5' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              Action Log
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
            {leftTab === 'usage' && (
              <div className="flex flex-col gap-6 animate-in fade-in">
                <section>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Usage Guide
                  </h2>
                  <div className="text-[11px] text-slate-400 leading-relaxed space-y-3">
                    <p>Welcome to the React PDF Hub SDK. This component empowers users to fill out, build, and view sophisticated PDF forms directly in the browser.</p>
                    <p><strong>To start:</strong> Use the right sidebar in the builder to add absolute-positioned form fields to your document layout.</p>
                  </div>
                </section>
                
                <hr className="border-white/5" />

                <section>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Extensibility
                  </h2>
                  <div className="text-[11px] text-slate-400 leading-relaxed space-y-3">
                    <p>The library provides headless hooks and a fully encapsulated UI:</p>
                    <code className="block bg-black/40 p-2 rounded border border-white/5 font-mono text-[10px] text-indigo-300">
                      import {'{ PDFHub, usePDFHub }'} from 'react-pdf-hub';
                    </code>
                  </div>
                </section>
              </div>
            )}

            {leftTab === 'api' && (
              <div className="flex flex-col gap-6 animate-in fade-in">
                <section>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Props API
                  </h2>
                  <ul className="text-[11px] text-slate-400 flex flex-col gap-3">
                    <li className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <code className="text-indigo-400 font-mono">initialFiles?</code>
                        <span className="text-[9px] uppercase font-bold text-slate-600">FileItem[]</span>
                      </div>
                      <span className="text-slate-500">Preload documents into the explorer.</span>
                    </li>
                    <li className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <code className="text-indigo-400 font-mono">onAction?</code>
                        <span className="text-[9px] uppercase font-bold text-slate-600">Function</span>
                      </div>
                      <span className="text-slate-500">Emits state changes. Demonstrated in the Action Log.</span>
                    </li>
                  </ul>
                </section>
                
                <hr className="border-white/5" />

                <section>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Types
                  </h2>
                  <pre className="text-[9px] bg-black/40 border border-white/5 p-3 rounded font-mono text-slate-400 overflow-x-auto word-break">
{`type FormFieldType = 
  | 'text' | 'textarea' 
  | 'checkbox' | 'radio'
  | 'select' | 'signature'
  | 'date' | 'password'
  | 'label';

interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  value?: string;
  ...
}`}
                  </pre>
                </section>
              </div>
            )}

            {leftTab === 'log' && (
              <div className="flex flex-col gap-2 h-full animate-in fade-in">
                <div className="flex justify-end mb-2">
                  <button onClick={() => setLogs([])} className="text-[9px] uppercase font-bold text-slate-600 hover:text-slate-300 transition-colors">Clear Logs</button>
                </div>
                {logs.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-[10px] text-slate-600 italic text-center px-4">
                    Interact with the PDF component to see dispatched actions...
                  </div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="bg-black/30 border border-white/5 rounded p-2 flex flex-col gap-1.5 animate-in fade-in group">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-emerald-400 font-bold">{log.type}</span>
                        <span className="text-[8px] text-slate-600">{log.time}</span>
                      </div>
                      <pre className="text-[9px] text-slate-400 font-mono whitespace-pre-wrap overflow-x-auto break-all">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </div>
                  ))
                )}
                <div ref={logEndRef} />
              </div>
            )}
          </div>
        </aside>

        {/* Center: Showcase component */}
        <section className="flex-1 flex flex-col relative bg-[#14161B] min-w-[500px]">
          <PDFHub onAction={handleAction} />
        </section>
      </main>
    </div>
  );
}
