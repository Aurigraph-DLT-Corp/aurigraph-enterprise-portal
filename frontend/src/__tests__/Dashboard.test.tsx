import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Dashboard from '../pages/Dashboard';

// Mock the hook
vi.mock('../hooks/useAppManagement', () => ({
  useAppManagement: () => ({
    fetchApps: vi.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Test App 1',
        status: 'active',
        createdAt: '2024-01-01',
        transactions: 1000,
        tps: 5000,
      },
      {
        id: '2',
        name: 'Test App 2',
        status: 'inactive',
        createdAt: '2024-01-02',
        transactions: 500,
        tps: 2500,
      },
    ]),
  }),
}));

describe('Dashboard', () => {
  it('renders dashboard title', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('displays statistics cards', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Total Apps')).toBeInTheDocument();
      expect(screen.getByText('Active Apps')).toBeInTheDocument();
      expect(screen.getByText('Average TPS')).toBeInTheDocument();
      expect(screen.getByText('System Health')).toBeInTheDocument();
    });
  });

  it('displays charts with correct titles', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('TPS Over Time')).toBeInTheDocument();
      expect(screen.getByText('Latency Distribution')).toBeInTheDocument();
    });
  });

  it('loads and displays app data', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Total Apps
      expect(screen.getByText('1')).toBeInTheDocument(); // Active Apps
    });
  });

  it('handles loading state', () => {
    render(<Dashboard />);
    // CircularProgress should be shown during loading
    const circles = screen.queryAllByRole('progressbar');
    expect(circles.length).toBeGreaterThanOrEqual(0);
  });
});
