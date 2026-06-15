import { useState, useCallback, useEffect } from 'react';
import { FileItem, DocumentState, FormField, FormFieldType } from './types';

export function usePDFHub(initialFiles: FileItem[] = [], onAction?: (action: any) => void) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  
  // States purely for the active "document" builder
  const [docState, setDocState] = useState<DocumentState>({
    id: 'draft',
    codeContent: '// Start coding here\nconsole.log("Hello, world!");',
    language: 'javascript',
    fields: [],
  });

  const activeFile = files.find(f => f.id === activeFileId);

  const addFile = useCallback((file: FileItem) => {
    setFiles(prev => [...prev, file]);
    setActiveFileId(file.id);
    onAction?.({ type: 'ADD_FILE', payload: file });
  }, [onAction]);

  const deleteFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (activeFileId === id) setActiveFileId(null);
    onAction?.({ type: 'DELETE_FILE', payload: id });
  }, [activeFileId, onAction]);

  const updateDocCode = useCallback((code: string) => {
    setDocState(prev => ({ ...prev, codeContent: code }));
  }, []);

  const setDocLanguage = useCallback((lang: string) => {
    setDocState(prev => ({ ...prev, language: lang }));
    onAction?.({ type: 'SET_LANGUAGE', payload: lang });
  }, [onAction]);

  const addField = useCallback((type: FormFieldType) => {
    setDocState(prev => {
      const yPos = 300 + (prev.fields.length * 60);
      const newField = {
        id: Math.random().toString(36).substring(2, 9),
        type,
        label: `New ${type}`,
        value: '',
        options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined,
        checked: type === 'checkbox' ? false : undefined,
        checkedOptions: type === 'checkbox' ? [] : undefined,
        x: 50,
        y: yPos,
        width: type === 'checkbox' || type === 'radio' ? 80 : 200,
        height: type === 'textarea' ? 80 : (type === 'signature' ? 64 : 32),
        required: false,
        readonly: false,
        placeholder: '',
        fontSize: 12,
        groupName: '',
      };
      // We wrap the onAction in a setTimeout or just call it:
      return {
      ...prev,
      fields: [
        ...prev.fields,
        newField
      ]
    }});
    onAction?.({ type: 'ADD_FIELD', payload: type });
  }, [onAction]);

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    setDocState(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
    onAction?.({ type: 'UPDATE_FIELD', payload: { id, updates } });
  }, [onAction]);

  const removeField = useCallback((id: string) => {
    setDocState(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== id)
    }));
    onAction?.({ type: 'REMOVE_FIELD', payload: id });
  }, [onAction]);

  const onSetActiveFileId = useCallback((id: string | null) => {
    setActiveFileId(id);
    onAction?.({ type: 'SET_ACTIVE_FILE', payload: id });
  }, [onAction]);

  return {
    files,
    activeFile,
    activeFileId,
    setActiveFileId: onSetActiveFileId,
    addFile,
    deleteFile,
    docState,
    updateDocCode,
    setDocLanguage,
    addField,
    updateField,
    removeField,
  };
}
