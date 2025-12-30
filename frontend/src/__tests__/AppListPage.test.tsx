import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AppListPage from '../pages/AppListPage';

const mockApps = [
  {
    id: '1',
    name: 'Alpha App',
    status: 'active',
    createdAt: '2024-01-01',
    transactions: 1000,
    tps: 5000,
  },
  {
    id: '2',
    name: 'Beta App',
    status: 'inactive',
    createdAt: '2024-01-02',
    transactions: 500,
    tps: 2500,
  },
];

vi.mock('../hooks/useAppManagement', () => ({
  useAppManagement: () => ({
    fetchApps: vi.fn().mockResolvedValue(mockApps),
    createApp: vi.fn().mockResolvedValue({
      id: '3',
      name: 'Gamma App',
      status: 'pending',
      createdAt: '2024-01-03',
      transactions: 0,
      tps: 0,
    }),
    deleteApp: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe('AppListPage', () => {
  it('renders page title', async () => {
    render(<AppListPage />);
    await waitFor(() => {
      expect(screen.getByText('Applications')).toBeInTheDocument();
    });
  });

  it('displays create new app button', async () => {
    render(<AppListPage />);
    await waitFor(() => {
      expect(screen.getByText('Create New App')).toBeInTheDocument();
    });
  });

  it('renders filter chips', async () => {
    render(<AppListPage />);
    await waitFor(() => {
      expect(screen.getByText('all')).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
      expect(screen.getByText('inactive')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
    });
  });

  it('renders sort chips', async () => {
    render(<AppListPage />);
    await waitFor(() => {
      const sortChips = screen.getAllByText(/name|created|tps/);
      expect(sortChips.length).toBeGreaterThan(0);
    });
  });

  it('searches for apps', async () => {
    const user = userEvent.setup();
    render(<AppListPage />);

    await waitFor(() => {
      expect(screen.getByText('Alpha App')).toBeInTheDocument();
    });

    const searchField = screen.getByPlaceholderText(/Search apps/i);
    await user.type(searchField, 'Beta');

    await waitFor(() => {
      expect(screen.getByText('Beta App')).toBeInTheDocument();
    });
  });

  it('filters apps by status', async () => {
    const user = userEvent.setup();
    render(<AppListPage />);

    await waitFor(() => {
      expect(screen.getByText('Alpha App')).toBeInTheDocument();
    });

    const activeFilter = screen.getAllByText('active')[0];
    await user.click(activeFilter);

    await waitFor(() => {
      expect(screen.getByText('Alpha App')).toBeInTheDocument();
    });
  });

  it('opens create dialog on button click', async () => {
    const user = userEvent.setup();
    render(<AppListPage />);

    await waitFor(() => {
      expect(screen.getByText('Create New App')).toBeInTheDocument();
    });

    const createButton = screen.getByText('Create New App');
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Create New Application')).toBeInTheDocument();
    });
  });

  it('displays app cards with correct data', async () => {
    render(<AppListPage />);

    await waitFor(() => {
      expect(screen.getByText('Alpha App')).toBeInTheDocument();
      expect(screen.getByText('Beta App')).toBeInTheDocument();
    });

    expect(screen.getByText('1000')).toBeInTheDocument(); // Transactions
    expect(screen.getByText('5000')).toBeInTheDocument(); // TPS
  });

  it('handles empty state', async () => {
    vi.mock('../hooks/useAppManagement', () => ({
      useAppManagement: () => ({
        fetchApps: vi.fn().mockResolvedValue([]),
        createApp: vi.fn(),
        deleteApp: vi.fn(),
      }),
    }));

    render(<AppListPage />);

    await waitFor(() => {
      expect(
        screen.queryByText('No apps found. Create one to get started.')
      ).toBeInTheDocument();
    });
  });
});
