import { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser, Check } from 'lucide-react';

interface Props {
  onSave: (url: string) => void;
  onClear?: () => void;
  initialUrl?: string | null;
}

export function SignaturePad({ onSave, onClear, initialUrl }: Props) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (initialUrl && sigCanvas.current) {
      sigCanvas.current.fromDataURL(initialUrl);
      setIsEmpty(false);
    }
  }, [initialUrl]);

  const handleClear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
    if (onClear) onClear();
  };

  const handleSave = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  const handleEnd = () => {
    setIsEmpty(false);
    // Auto save on end drawing?
    handleSave();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="border border-white/10 rounded overflow-hidden bg-black/20 relative group">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: 'w-full h-24 cursor-crosshair touch-none',
            style: { width: '100%', height: '96px' }
          }}
          penColor="currentColor"
          backgroundColor="transparent"
          onEnd={handleEnd}
        />
        {isEmpty && !initialUrl && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-500 font-medium text-[10px] uppercase tracking-wider">
            Draw signature
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-end">
        <button
          onClick={handleClear}
          className="flex items-center gap-1 px-2 py-1 text-[9px] font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded uppercase transition-colors"
          type="button"
        >
          <Eraser className="w-3 h-3" />
          Clear
        </button>
      </div>
    </div>
  );
}
