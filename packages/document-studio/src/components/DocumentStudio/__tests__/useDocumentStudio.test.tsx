import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDocumentStudio } from '../useDocumentStudio';

describe('useDocumentStudio Hook', () => {
  it('initializes with default structure', () => {
    const { result } = renderHook(() => useDocumentStudio([]));
    
    expect(result.current.files).toEqual([]);
    expect(result.current.activeFileId).toBeNull();
    expect(result.current.docState.fields.length).toBe(0);
    expect(result.current.docState.language).toBe('javascript');
  });

  it('can add and remove custom PDF form fields', () => {
    const { result } = renderHook(() => useDocumentStudio([]));
    
    act(() => {
      result.current.addField('text');
    });
    
    expect(result.current.docState.fields.length).toBe(1);
    expect(result.current.docState.fields[0].type).toBe('text');
    
    const fieldId = result.current.docState.fields[0].id;
    
    act(() => {
      result.current.updateField(fieldId, { label: 'First Name' });
    });
    
    expect(result.current.docState.fields[0].label).toBe('First Name');

    act(() => {
      result.current.removeField(fieldId);
    });

    expect(result.current.docState.fields.length).toBe(0);
  });

  it('handles field coordinate positional updates', () => {
    const { result } = renderHook(() => useDocumentStudio([]));
    
    act(() => {
      result.current.addField('signature');
    });
    
    const fieldId = result.current.docState.fields[0].id;
    
    act(() => {
      result.current.updateField(fieldId, { x: 100, y: 200, width: 300, height: 150 });
    });
    
    expect(result.current.docState.fields[0].x).toBe(100);
    expect(result.current.docState.fields[0].y).toBe(200);
    expect(result.current.docState.fields[0].width).toBe(300);
    expect(result.current.docState.fields[0].height).toBe(150);
  });
});
