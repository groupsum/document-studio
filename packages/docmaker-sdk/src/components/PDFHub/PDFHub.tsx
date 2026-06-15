import { usePDFHub } from './usePDFHub';
import { PDFHubProps } from './types';
import { PDFViewer } from './PDFViewer';
import { DocumentBuilder } from './DocumentBuilder';
import { cn } from '../../lib/utils';

export function PDFHub({ initialFiles = [], theme = 'system', onAction, className }: PDFHubProps) {
  const hub = usePDFHub(initialFiles, onAction);

  return (
    <div className={cn(
      "flex h-full w-full bg-transparent font-sans text-slate-300 overflow-hidden",
      className
    )}>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-[#14161B] relative flex flex-col">
        {hub.activeFile ? (
          <PDFViewer file={hub.activeFile} />
        ) : (
          <DocumentBuilder 
            state={hub.docState}
            updateCode={hub.updateDocCode}
            setLanguage={hub.setDocLanguage}
            addField={hub.addField}
            updateField={hub.updateField}
            removeField={hub.removeField}
            theme={theme}
          />
        )}
      </div>

    </div>
  );
}
