import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Stack,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download as DownloadIcon } from '@mui/icons-material';

interface AnalyticsData {
  timestamp: string;
  transactions: number;
  tps: number;
  latency: number;
  errors: number;
  activeUsers: number;
}

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);

        // Generate mock analytics data based on time range
        const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
        const mockData: AnalyticsData[] = Array.from({ length: hours }, (_, i) => ({
          timestamp: new Date(Date.now() - (hours - i) * 3600000).toLocaleTimeString(
            'en-US',
            { hour: '2-digit', minute: '2-digit' }
          ),
          transactions: Math.floor(Math.random() * 50000) + 10000,
          tps: Math.floor(Math.random() * 200000) + 50000,
          latency: Math.floor(Math.random() * 500) + 50,
          errors: Math.floor(Math.random() * 100),
          activeUsers: Math.floor(Math.random() * 500) + 100,
        }));

        setData(mockData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load analytics'
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [timeRange]);

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Transactions', 'TPS', 'Latency (ms)', 'Errors', 'Active Users'],
      ...data.map((row) => [
        row.timestamp,
        row.transactions,
        row.tps,
        row.latency,
        row.errors,
        row.activeUsers,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}-${Date.now()}.csv`;
    a.click();
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Analytics</Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
        >
          Export CSV
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Time Range Selection */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Stack direction="row" spacing={2}>
          {(['24h', '7d', '30d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'contained' : 'outlined'}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </Stack>
      </Paper>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography color="textSecondary" gutterBottom>
              Total Transactions
            </Typography>
            <Typography variant="h5">
              {data.reduce((sum, d) => sum + d.transactions, 0).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography color="textSecondary" gutterBottom>
              Avg TPS
            </Typography>
            <Typography variant="h5">
              {Math.round(
                data.reduce((sum, d) => sum + d.tps, 0) / data.length
              ).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography color="textSecondary" gutterBottom>
              Avg Latency
            </Typography>
            <Typography variant="h5">
              {Math.round(
                data.reduce((sum, d) => sum + d.latency, 0) / data.length
              )}
              ms
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography color="textSecondary" gutterBottom>
              Total Errors
            </Typography>
            <Typography variant="h5">
              {data.reduce((sum, d) => sum + d.errors, 0)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Volume
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="transactions"
                  fill="#8884d8"
                  stroke="#8884d8"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              TPS Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tps"
                  stroke="#82ca9d"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Latency Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="latency"
                  fill="#ffc658"
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Error Rate
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="errors"
                  fill="#ff7c7c"
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsPage;
