import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ExecutiveDashboard } from '../../pages/ExecutiveDashboard';
import { vi } from 'vitest';

// Mock recharts to avoid rendering SVGs in jsdom
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  AreaChart: () => <div data-testid="area-chart" />,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  BarChart: () => <div data-testid="bar-chart" />,
  Bar: () => null,
}));

describe('ExecutiveDashboard Component', () => {
  const renderDashboard = () => {
    return render(
      <HelmetProvider>
        <BrowserRouter>
          <ExecutiveDashboard />
        </BrowserRouter>
      </HelmetProvider>
    );
  };

  it('renders the loading state initially', () => {
    renderDashboard();
    expect(screen.getByText(/Aggregating Live APIs/i)).toBeInTheDocument();
  });


});
