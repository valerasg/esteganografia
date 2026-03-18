import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip Component', () => {
  it('renders its children correctly', () => {
    render(
      <Tooltip content="Tooltip message">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('contains the tooltip text with correctly applied roles', () => {
    render(
      <Tooltip content="Secret Tooltip">
        <span>Target</span>
      </Tooltip>
    );
    // The tooltip text should be present in the document
    const tooltipElem = screen.getByText('Secret Tooltip');
    expect(tooltipElem).toBeInTheDocument();
    
    // Check if the container has role="tooltip"
    const roleElem = screen.getByRole('tooltip', { hidden: true });
    expect(roleElem).toBeInTheDocument();
  });
});
