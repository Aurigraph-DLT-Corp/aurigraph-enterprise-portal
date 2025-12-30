import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand: string;
  expiryDate: string;
  isDefault: boolean;
}

export const BillingPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const loadBillingData = async () => {
      try {
        setLoading(true);

        // Mock invoices
        const mockInvoices: Invoice[] = Array.from({ length: 25 }, (_, i) => ({
          id: `INV-${String(i + 1).padStart(5, '0')}`,
          date: new Date(
            Date.now() - i * 30 * 24 * 3600000
          ).toLocaleDateString(),
          amount: Math.floor(Math.random() * 500) + 100,
          status: ['paid', 'pending', 'failed'][
            Math.floor(Math.random() * 3)
          ] as any,
          description: `Monthly subscription for ${new Date(
            Date.now() - i * 30 * 24 * 3600000
          ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
          downloadUrl: '#',
        }));

        // Mock payment methods
        const mockPaymentMethods: PaymentMethod[] = [
          {
            id: '1',
            type: 'card',
            last4: '4242',
            brand: 'Visa',
            expiryDate: '12/2025',
            isDefault: true,
          },
          {
            id: '2',
            type: 'card',
            last4: '5555',
            brand: 'Mastercard',
            expiryDate: '08/2026',
            isDefault: false,
          },
          {
            id: '3',
            type: 'bank',
            last4: '6789',
            brand: 'Bank Account',
            expiryDate: 'N/A',
            isDefault: false,
          },
        ];

        setInvoices(mockInvoices);
        setPaymentMethods(mockPaymentMethods);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load billing data'
        );
      } finally {
        setLoading(false);
      }
    };

    loadBillingData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const displayedInvoices = invoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Billing & Invoices
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Next Billing Date
              </Typography>
              <Typography variant="h5">
                {new Date(Date.now() + 30 * 24 * 3600000).toLocaleDateString()}
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 2 }}>
                Your next payment will be charged on this date
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Current Plan
              </Typography>
              <Typography variant="h5">Professional</Typography>
              <Typography color="textSecondary" sx={{ mt: 2 }}>
                $99.00 per month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Methods Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Payment Methods</Typography>
          <Button variant="contained">Add Payment Method</Button>
        </Box>

        <Stack spacing={2}>
          {paymentMethods.map((method) => (
            <Card key={method.id} variant="outlined">
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="subtitle1">
                    {method.brand} •••• {method.last4}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Expires {method.expiryDate}
                  </Typography>
                </Box>
                <Box>
                  {method.isDefault && (
                    <Chip label="Default" size="small" color="primary" />
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Paper>

      {/* Invoices Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Billing History
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Invoice ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedInvoices.map((invoice) => (
                <TableRow key={invoice.id} hover>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell align="right">
                    ${invoice.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status}
                      color={getStatusColor(invoice.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => {
                        // Handle download
                      }}
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={invoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default BillingPage;
