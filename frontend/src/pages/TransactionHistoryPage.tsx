import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface Transaction {
  id: string;
  timestamp: string;
  sender: string;
  receiver: string;
  amount: number;
  fee: number;
  status: 'confirmed' | 'pending' | 'failed';
  blockNumber: number;
  gasUsed: number;
}

export const TransactionHistoryPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);

        // Generate mock transactions
        const mockTxs: Transaction[] = Array.from({ length: 100 }, (_, i) => ({
          id: `0x${Math.random().toString(16).substr(2, 40)}`,
          timestamp: new Date(
            Date.now() - Math.random() * 24 * 3600000
          ).toLocaleString(),
          sender: `0x${Math.random().toString(16).substr(2, 40)}`,
          receiver: `0x${Math.random().toString(16).substr(2, 40)}`,
          amount: Math.random() * 1000,
          fee: Math.random() * 10,
          status: ['confirmed', 'pending', 'failed'][
            Math.floor(Math.random() * 3)
          ] as any,
          blockNumber: Math.floor(Math.random() * 1000000),
          gasUsed: Math.floor(Math.random() * 100000),
        }));

        setTransactions(mockTxs);
        applyFilters(mockTxs, searchTerm, filterStatus);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load transactions'
        );
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const applyFilters = (
    txs: Transaction[],
    search: string,
    status: string
  ) => {
    let filtered = txs;

    if (search) {
      filtered = filtered.filter(
        (tx) =>
          tx.id.includes(search) ||
          tx.sender.includes(search) ||
          tx.receiver.includes(search)
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter((tx) => tx.status === status);
    }

    setFilteredTransactions(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(transactions, value, filterStatus);
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    applyFilters(transactions, searchTerm, status);
  };

  const handleViewDetails = (tx: Transaction) => {
    setSelectedTx(tx);
    setOpenDetailDialog(true);
  };

  const handleExport = () => {
    const csv = [
      [
        'Transaction ID',
        'Timestamp',
        'Sender',
        'Receiver',
        'Amount',
        'Fee',
        'Status',
        'Block Number',
      ],
      ...filteredTransactions.map((tx) => [
        tx.id,
        tx.timestamp,
        tx.sender,
        tx.receiver,
        tx.amount,
        tx.fee,
        tx.status,
        tx.blockNumber,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${Date.now()}.csv`;
    a.click();
  };

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
      case 'confirmed':
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

  const displayedTxs = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Transaction History</Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
        >
          Export CSV
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack spacing={2}>
          <TextField
            placeholder="Search by TX ID, sender, or receiver..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ alignSelf: 'center' }}>Filter:</Typography>
            {['all', 'confirmed', 'pending', 'failed'].map((status) => (
              <Chip
                key={status}
                label={status}
                onClick={() => handleFilterChange(status)}
                variant={filterStatus === status ? 'filled' : 'outlined'}
              />
            ))}
          </Box>

          <Typography color="textSecondary" variant="caption">
            Showing {displayedTxs.length} of {filteredTransactions.length} transactions
          </Typography>
        </Stack>
      </Paper>

      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Sender</TableCell>
              <TableCell>Receiver</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Fee</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedTxs.map((tx) => (
              <TableRow key={tx.id} hover>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {tx.id.substring(0, 10)}...
                </TableCell>
                <TableCell>{tx.timestamp}</TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {tx.sender.substring(0, 10)}...
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {tx.receiver.substring(0, 10)}...
                </TableCell>
                <TableCell align="right">{tx.amount.toFixed(6)}</TableCell>
                <TableCell align="right">{tx.fee.toFixed(6)}</TableCell>
                <TableCell>
                  <Chip
                    label={tx.status}
                    color={getStatusColor(tx.status)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewDetails(tx)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} fullWidth>
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          {selectedTx && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography color="textSecondary" variant="caption">
                  Transaction ID
                </Typography>
                <Typography sx={{ fontFamily: 'monospace' }}>
                  {selectedTx.id}
                </Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="caption">
                  Timestamp
                </Typography>
                <Typography>{selectedTx.timestamp}</Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="caption">
                  From
                </Typography>
                <Typography sx={{ fontFamily: 'monospace' }}>
                  {selectedTx.sender}
                </Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="caption">
                  To
                </Typography>
                <Typography sx={{ fontFamily: 'monospace' }}>
                  {selectedTx.receiver}
                </Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="caption">
                  Amount / Fee
                </Typography>
                <Typography>
                  {selectedTx.amount.toFixed(6)} / {selectedTx.fee.toFixed(6)}
                </Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="caption">
                  Block Number
                </Typography>
                <Typography>{selectedTx.blockNumber}</Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="caption">
                  Status
                </Typography>
                <Chip
                  label={selectedTx.status}
                  color={getStatusColor(selectedTx.status)}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TransactionHistoryPage;
