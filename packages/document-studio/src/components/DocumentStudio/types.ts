export type FileItem = {
  id: string;
  name: string;
  url: string; // Blob URL or actual URL
  type: 'pdf' | 'document';
  createdAt: string;
};

export type FormFieldType = 
  | 'label' 
  | 'text' 
  | 'textarea' 
  | 'date' 
  | 'checkbox' 
  | 'radio' 
  | 'select' 
  | 'password'
  | 'signature';

export type FormField = {
  id: string;
  type: FormFieldType;
  label: string;
  value: string;
  options?: string[]; // For select and radio
  checked?: boolean; // For checkbox
  x: number;
  y: number;
  width: number;
  height: number;
  required?: boolean;
  readonly?: boolean;
  placeholder?: string;
  fontSize?: number;
  maxLength?: number;
  checkedOptions?: string[];
  groupName?: string;
};

export type DocumentState = {
  id: string;
  codeContent: string;
  language: string; // for syntax highlighting
  fields: FormField[];
};

export interface DocumentStudioProps {
  initialFiles?: FileItem[];
  theme?: 'light' | 'dark' | 'system';
  onFileSave?: (file: FileItem) => void;
  onExport?: (blob: Blob, filename: string) => void;
  onAction?: (action: any) => void;
  className?: string;
}
