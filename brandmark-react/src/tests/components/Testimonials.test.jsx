import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Testimonials } from '../../components/Testimonials';
import { formatEmbedUrl, isDirectVideo } from '../../lib/videoUtils';

// Mock GSAP to avoid issues in Node test environment
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    fromTo: vi.fn(),
    context: vi.fn((fn) => {
      fn();
      return { revert: vi.fn() };
    }),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

describe('Testimonials Video Helpers', () => {
  it('identifies direct video formats', () => {
    expect(isDirectVideo('https://example.com/demo.mp4')).toBe(true);
    expect(isDirectVideo('https://example.com/clip.webm?token=123')).toBe(true);
    expect(isDirectVideo('https://example.com/video', 'direct')).toBe(true);
    expect(isDirectVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(false);
  });

  it('formats standard YouTube URLs into embed URLs with autoplay', () => {
    const raw = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const formatted = formatEmbedUrl(raw, 'youtube');
    expect(formatted).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1');
  });

  it('formats YouTube Shorts URLs into embed URLs', () => {
    const raw = 'https://www.youtube.com/shorts/abc123xyz45';
    const formatted = formatEmbedUrl(raw);
    expect(formatted).toBe('https://www.youtube-nocookie.com/embed/abc123xyz45?autoplay=1&rel=0&modestbranding=1');
  });

  it('formats Vimeo URLs into embed URLs', () => {
    const raw = 'https://vimeo.com/76979871';
    const formatted = formatEmbedUrl(raw);
    expect(formatted).toBe('https://player.vimeo.com/video/76979871?autoplay=1');
  });

  it('formats Loom URLs into embed URLs', () => {
    const raw = 'https://www.loom.com/share/a1b2c3d4e5f6';
    const formatted = formatEmbedUrl(raw);
    expect(formatted).toBe('https://www.loom.com/embed/a1b2c3d4e5f6?autoplay=1');
  });
});

describe('Testimonials Component', () => {
  beforeEach(() => {
    // Reset any body styles
    document.body.style.overflow = '';
  });

  it('renders section title, subtitle, and trust badges', () => {
    render(<Testimonials />);
    expect(screen.getByText(/Trusted by Creators, Founders & Enterprises/i)).toBeInTheDocument();
    expect(screen.getByText(/98% Satisfaction/i)).toBeInTheDocument();
    expect(screen.getByText(/Fast Execution/i)).toBeInTheDocument();
  });

  it('renders both video testimonials and text reviews', () => {
    render(<Testimonials />);
    // Check video creator
    expect(screen.getByText('Aman Verma')).toBeInTheDocument();
    expect(screen.getByText('@amanverma_growth')).toBeInTheDocument();

    // Check text review client
    expect(screen.getByText('Rajesh Sharma')).toBeInTheDocument();
    expect(screen.getByText('Founder, TechVista Solutions')).toBeInTheDocument();
  });

  it('filters between Video Stories and Client Reviews', () => {
    render(<Testimonials />);
    
    // Initially all stories are visible
    expect(screen.getByText('Aman Verma')).toBeInTheDocument();
    expect(screen.getByText('Rajesh Sharma')).toBeInTheDocument();

    // Filter to Video Stories only
    const videoBtn = screen.getByRole('button', { name: /Video Stories/i });
    fireEvent.click(videoBtn);
    expect(screen.getByText('Aman Verma')).toBeInTheDocument();
    expect(screen.queryByText('Rajesh Sharma')).not.toBeInTheDocument();

    // Filter to Client Reviews only
    const textBtn = screen.getByRole('button', { name: /Client Reviews/i });
    fireEvent.click(textBtn);
    expect(screen.queryByText('Aman Verma')).not.toBeInTheDocument();
    expect(screen.getByText('Rajesh Sharma')).toBeInTheDocument();
  });

  it('opens video modal on video thumbnail click and closes on close button', () => {
    render(<Testimonials />);
    
    // Find the play trigger for Aman Verma
    const playHint = screen.getAllByText(/Click to watch feedback/i)[0];
    fireEvent.click(playHint);

    // Modal should now be open
    const modalHeading = screen.getAllByText('Aman Verma');
    expect(modalHeading.length).toBeGreaterThan(1);
    const closeBtn = screen.getByRole('button', { name: /Close Video Player/i });
    expect(closeBtn).toBeInTheDocument();

    // Close modal
    fireEvent.click(closeBtn);
  });
});
