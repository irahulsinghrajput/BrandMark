import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrandMarkGPT } from '../../pages/BrandMarkGPT';

describe('BrandMarkGPT Component', () => {
  const renderGPT = () => {
    return render(
      <HelmetProvider>
        <BrowserRouter>
          <BrandMarkGPT />
        </BrowserRouter>
      </HelmetProvider>
    );
  };

  it('renders the chat interface header', () => {
    renderGPT();
    expect(screen.getByRole('heading', { name: /^BrandMark GPT$/i })).toBeInTheDocument();
    expect(screen.getByText(/Powered by pgvector/i)).toBeInTheDocument();
  });

  it('allows user to type in the input field', () => {
    renderGPT();
    const input = screen.getByPlaceholderText(/Ask anything based on BrandMark/i);
    fireEvent.change(input, { target: { value: 'How do I onboard a client?' } });
    expect(input.value).toBe('How do I onboard a client?');
  });

  it('renders model selection dropdown', () => {
    renderGPT();
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select.value).toBe('gpt-4o');
  });
});
