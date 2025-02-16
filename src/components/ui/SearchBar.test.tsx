import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

// Mock the cn utility function
vi.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.join(' '),
}));

describe('SearchBar', () => {
  it('renders with default placeholder', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByPlaceholderText('Ieškoti...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar onSearch={() => {}} placeholder="Custom placeholder" />);
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('calls onSearch with input value when form is submitted', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Ieškoti...');
    const searchText = 'test search';
    
    fireEvent.change(input, { target: { value: searchText } });
    fireEvent.submit(screen.getByTestId('search-form'));
    
    expect(mockOnSearch).toHaveBeenCalledWith(searchText);
  });
}); 