import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Pause as PauseIcon, PlayArrow as PlayIcon } from '@mui/icons-icons';
import { useWebSocket } from '../hooks/useWebSocket';

interface RealtimeTransaction {
  id: string;
  timestamp: string;
  sender: string;
  receiver: string;
  amount: number;
  status: 'confirmed' | 'pending';
}

export const RealTimeFeedPage: React.FC = () => {
  const [transactions, setTransactions] = useState<RealtimeTransaction[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [tpsCount, setTpsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const txCountRef = useRef(0);

  const { connect, disconnect, isConnected, on } = useWebSocket();

  useEffect(() => {
    // Connect to WebSocket
    const ws = connect('wss://dlt.aurigraph.io/api/v12/realtime');

    // Listen for new transactions
    on('transaction', (data: RealtimeTransaction) => {
      if (isLive) {
        setTransactions((prev) => [data, ...prev.slice(0, 99)]);
        txCountRef.current++;
      }
    });

    // Calculate TPS every second
    const tpsInterval = setInterval(() => {
      setTpsCount(txCountRef.current);
      txCountRef.current = 0;
    }, 1000);

    return () => {
      clearInterval(tpsInterval);
      disconnect();
    };
  }, [connect, disconnect, on, isLive]);

  const toggleLive = () => {
    setIsLive(!isLive);
  };

  const getStatusColor = (status: string) => {
    return status === 'confirmed' ? 'success' : 'warning';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Real-Time Transaction Feed
        </Typography>
        <Typography color="textSecondary">
          Live blockchain transaction stream
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Live Stats */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={3}>
          <Box>
            <Typography color="textSecondary" variant="caption">
              Connection Status
            </Typography>
            <Chip
              label={isConnected ? 'Connected' : 'Disconnected'}
              color={isConnected ? 'success' : 'error'}
            />
          </Box>
          <Box>
            <Typography color="textSecondary" variant="caption">
              Current TPS
            </Typography>
            <Typography variant="h5">{tpsCount}</Typography>
          </Box>
          <Box>
            <Typography color="textSecondary" variant="caption">
              Live Transactions
            </Typography>
            <Typography variant="h5">{transactions.length}</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Button
              variant={isLive ? 'contained' : 'outlined'}
              startIcon={isLive ? <PauseIcon /> : <PlayIcon />}
              onClick={toggleLive}
            >
              {isLive ? 'Pause' : 'Resume'}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Transaction Feed */}
      <Paper>
        {transactions.length > 0 ? (
          <List sx={{ maxHeight: '600px', overflow: 'auto' }}>
            {transactions.map((tx, idx) => (
              <div key={tx.id}>
                {idx > 0 && <Divider />}
                <ListItem sx={{ py: 2 }}>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {tx.id.substring(0, 12)}...
                        </Typography>
                        <Chip
                          label={tx.status}
                          color={getStatusColor(tx.status)}
                          size="small"
                          variant="outlined"
                        />
                        <Typography variant="caption" color="textSecondary">
                          {tx.timestamp}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Stack spacing={0.5} sx={{ mt: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          From: <span style={{ fontFamily: 'monospace' }}>
                            {tx.sender.substring(0, 12)}...
                          </span>
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          To: <span style={{ fontFamily: 'monospace' }}>
                            {tx.receiver.substring(0, 12)}...
                          </span>
                        </Typography>
                        <Typography variant="caption">
                          Amount: <strong>{tx.amount.toFixed(6)}</strong>
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
              </div>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            {isConnected ? (
              <Box>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography color="textSecondary">
                  Waiting for transactions...
                </Typography>
              </Box>
            ) : (
              <Alert severity="warning">
                WebSocket connection failed. Please refresh the page.
              </Alert>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default RealTimeFeedPage;
