import Editor from '@monaco-editor/react';

interface Props {
  code: string;
  language: string;
  theme?: 'light' | 'dark' | 'system';
  onChange: (value: string | undefined) => void;
}

export function CodeEditor({ code, language, theme = 'light', onChange }: Props) {
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="h-full w-full rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-800">
      <Editor
        height="100%"
        language={language}
        theme={isDark ? 'vs-dark' : 'light'}
        value={code}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace',
          formatOnType: true,
          formatOnPaste: true,
        }}
      />
    </div>
  );
}
