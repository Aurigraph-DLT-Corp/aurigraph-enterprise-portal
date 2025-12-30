import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlansPage from '../pages/PlansPage';

describe('PlansPage', () => {
  it('renders page title', () => {
    render(<PlansPage />);
    expect(screen.getByText('Plans & Pricing')).toBeInTheDocument();
  });

  it('displays view mode toggle buttons', async () => {
    render(<PlansPage />);
    await waitFor(() => {
      expect(screen.getByText('Card View')).toBeInTheDocument();
      expect(screen.getByText('Compare')).toBeInTheDocument();
    });
  });

  it('displays billing cycle toggle buttons', async () => {
    render(<PlansPage />);
    await waitFor(() => {
      expect(screen.getByText('Monthly')).toBeInTheDocument();
      expect(screen.getByText('Yearly (20% off)')).toBeInTheDocument();
    });
  });

  it('displays plan cards in card view', async () => {
    render(<PlansPage />);
    await waitFor(() => {
      expect(screen.getByText('Starter')).toBeInTheDocument();
      expect(screen.getByText('Professional')).toBeInTheDocument();
      expect(screen.getByText('Enterprise')).toBeInTheDocument();
    });
  });

  it('displays popular badge on professional plan', async () => {
    render(<PlansPage />);
    await waitFor(() => {
      const popularChips = screen.getAllByText('Popular');
      expect(popularChips.length).toBeGreaterThan(0);
    });
  });

  it('shows plan features in cards', async () => {
    render(<PlansPage />);
    await waitFor(() => {
      expect(
        screen.getByText('Up to 100K transactions/month')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Up to 1M transactions/month')
      ).toBeInTheDocument();
    });
  });

  it('displays choose plan button for each plan', async () => {
    render(<PlansPage />);
    await waitFor(() => {
      const buttons = screen.getAllByText('Choose Plan');
      expect(buttons.length).toBe(3);
    });
  });

  it('switches to comparison view', async () => {
    const user = userEvent.setup();
    render(<PlansPage />);

    await waitFor(() => {
      expect(screen.getByText('Card View')).toBeInTheDocument();
    });

    const compareButton = screen.getByText('Compare');
    await user.click(compareButton);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  it('switches billing cycle to yearly', async () => {
    const user = userEvent.setup();
    render(<PlansPage />);

    await waitFor(() => {
      expect(screen.getByText('Monthly')).toBeInTheDocument();
    });

    const yearlyButton = screen.getByText('Yearly (20% off)');
    await user.click(yearlyButton);

    await waitFor(() => {
      // Prices should be updated (annual)
      expect(screen.getByText('/year')).toBeInTheDocument();
    });
  });

  it('displays comparison table with features', async () => {
    const user = userEvent.setup();
    render(<PlansPage />);

    await waitFor(() => {
      const compareButton = screen.getByText('Compare');
      expect(compareButton).toBeInTheDocument();
    });

    const compareButton = screen.getByText('Compare');
    await user.click(compareButton);

    await waitFor(() => {
      expect(screen.getByText(/Transactions\/month/)).toBeInTheDocument();
      expect(screen.getByText('Storage')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
    });
  });
});
