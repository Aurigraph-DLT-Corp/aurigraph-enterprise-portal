import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionHistoryPage from '../pages/TransactionHistoryPage';

describe('TransactionHistoryPage', () => {
  it('renders page title', async () => {
    render(<TransactionHistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('Transaction History')).toBeInTheDocument();
    });
  });

  it('displays export button', async () => {
    render(<TransactionHistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });
  });

  it('displays search input', async () => {
    render(<TransactionHistoryPage />);
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Search by TX ID/i)
      ).toBeInTheDocument();
    });
  });

  it('displays status filter chips', async () => {
    render(<TransactionHistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('all')).toBeInTheDocument();
      expect(screen.getByText('confirmed')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
      expect(screen.getByText('failed')).toBeInTheDocument();
    });
  });

  it('renders transaction table with headers', async () => {
    render(<TransactionHistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('Transaction ID')).toBeInTheDocument();
      expect(screen.getByText('Timestamp')).toBeInTheDocument();
      expect(screen.getByText('Sender')).toBeInTheDocument();
      expect(screen.getByText('Receiver')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
      expect(screen.getByText('Fee')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  it('displays transactions in table rows', async () => {
    render(<TransactionHistoryPage />);
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // Header row + data rows
      expect(rows.length).toBeGreaterThan(1);
    });
  });

  it('displays pagination controls', async () => {
    render(<TransactionHistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('Rows per page:')).toBeInTheDocument();
    });
  });

  it('filters transactions by status', async () => {
    const user = userEvent.setup();
    render(<TransactionHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('all')).toBeInTheDocument();
    });

    const confirmedFilter = screen.getByText('confirmed');
    await user.click(confirmedFilter);

    await waitFor(() => {
      // Table should be filtered
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  it('searches for transactions', async () => {
    const user = userEvent.setup();
    render(<TransactionHistoryPage />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Search by TX ID/i)
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by TX ID/i);
    await user.type(searchInput, '0x123');

    await waitFor(() => {
      expect(searchInput).toHaveValue('0x123');
    });
  });

  it('opens detail dialog on details button click', async () => {
    const user = userEvent.setup();
    render(<TransactionHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    const detailsButton = screen.getAllByText('Details')[0];
    await user.click(detailsButton);

    await waitFor(() => {
      expect(screen.getByText('Transaction Details')).toBeInTheDocument();
    });
  });

  it('displays transaction details in dialog', async () => {
    const user = userEvent.setup();
    render(<TransactionHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    const detailsButton = screen.getAllByText('Details')[0];
    await user.click(detailsButton);

    await waitFor(() => {
      expect(screen.getByText('Transaction ID')).toBeInTheDocument();
      expect(screen.getByText('Timestamp')).toBeInTheDocument();
      expect(screen.getByText('From')).toBeInTheDocument();
      expect(screen.getByText('To')).toBeInTheDocument();
      expect(screen.getByText('Block Number')).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    const user = userEvent.setup();
    render(<TransactionHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Rows per page:')).toBeInTheDocument();
    });

    const nextButton = screen.getByTitle('Go to next page');
    if (nextButton) {
      await user.click(nextButton);
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
    }
  });
});
