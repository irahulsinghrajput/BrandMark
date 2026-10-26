import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CertificateModal } from '../../components/CertificateModal';

describe('CertificateModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <CertificateModal
        isOpen={false}
        onClose={vi.fn()}
        userName="Rahul Rajput"
        courseTitle="Digital Marketing Mastery with Gen AI"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly with student name and Digital Marketing curriculum matching Image 2', () => {
    render(
      <CertificateModal
        isOpen={true}
        onClose={vi.fn()}
        userName="Rahul Rajput"
        courseTitle="Digital Marketing Mastery with Gen AI"
      />
    );

    // Header & Lead
    expect(screen.getByText(/This is to certify that/i)).toBeInTheDocument();
    expect(screen.getByText(/\[Rahul Rajput\]/i)).toBeInTheDocument();
    expect(screen.getByText(/has successfully completed the comprehensive/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional Course in Digital Marketing/i)).toBeInTheDocument();

    // Image 2 Syllabus Highlights
    expect(screen.getByText(/SEO, SEM • SMM/i)).toBeInTheDocument();
    expect(screen.getByText(/SMM And Marketing/i)).toBeInTheDocument();
    expect(screen.getByText(/Content Strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/CBP\+ Content Modules/i)).toBeInTheDocument();

    // Dual Signatures
    expect(screen.getByText(/Course Director:/i)).toBeInTheDocument();
    expect(screen.getByText(/Rahul Singh Rajput/i)).toBeInTheDocument();
    expect(screen.getByText(/Brand Mark Solution CEO:/i)).toBeInTheDocument();
    expect(screen.getByText(/Rajeshree Shekhar/i)).toBeInTheDocument();

    // Brand and Site Verification
    expect(screen.getAllByText(/BrandMark Solutions/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/brandmarksolutions\.site/i).length).toBeGreaterThanOrEqual(1);
  });

  it('triggers onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <CertificateModal
        isOpen={true}
        onClose={handleClose}
        userName="Rahul Rajput"
        courseTitle="Digital Marketing Mastery with Gen AI"
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('invokes window.print when print button is clicked', () => {
    const originalPrint = window.print;
    window.print = vi.fn();

    render(
      <CertificateModal
        isOpen={true}
        onClose={vi.fn()}
        userName="Rahul Rajput"
        courseTitle="Digital Marketing Mastery with Gen AI"
      />
    );

    const printButton = screen.getByText(/Print \/ Save as PDF/i);
    fireEvent.click(printButton);
    expect(window.print).toHaveBeenCalledTimes(1);

    window.print = originalPrint;
  });
});
