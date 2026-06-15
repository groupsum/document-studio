import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentStudio } from '../DocumentStudio';

describe('DocumentStudio Component', () => {
  it('renders standard builder as main view', () => {
    render(<DocumentStudio />);
    
    // Check live preview canvas is shown
    expect(screen.getByRole('region', { name: /Document Live Preview Canvas/i })).toBeDefined();
    
    // Check editor sidebar
    expect(screen.getByRole('complementary', { name: /Field and Document Properties/i })).toBeDefined();
  });

  it('provides accessible field injection tools', () => {
    render(<DocumentStudio />);
    
    const addLabelBtn = screen.getAllByRole('button', { name: /Add Label Field/i })[0];
    expect(addLabelBtn).not.toBeNull();
    
    fireEvent.click(addLabelBtn);
    
    const fieldLabelInputs = screen.getAllByLabelText(/Field Label/i);
    expect(fieldLabelInputs.length).toBeGreaterThan(0);
  });
});
