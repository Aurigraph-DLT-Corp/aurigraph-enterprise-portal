import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { Download as DownloadIcon } from '@mui/icons-material';
import { LatencyHistogram } from '../components/LatencyHistogram';
import { FinilityIndicator } from '../components/FinilityIndicator';
import { AnalyticsPanel } from '../components/AnalyticsPanel';

interface PerformanceMetrics {
  timestamp: string;
  tps: number;
  latency: number;
  finality: number;
  blockTime: number;
  validatorCount: number;
}

interface LatencyPercentiles {
  p50: number;
  p95: number;
  p99: number;
  max: number;
}

export const PerformanceMetricsPage: React.FC = () => {
  const [metricsData, setMetricsData] = useState<PerformanceMetrics[]>([]);
  const [latencyPercentiles, setLatencyPercentiles] =
    useState<LatencyPercentiles | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);

        // Generate mock performance data
        const hours = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : 168;
        const mockData: PerformanceMetrics[] = Array.from({ length: hours }, (_, i) => ({
          timestamp: new Date(
            Date.now() - (hours - i) * 3600000
          ).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          tps: Math.floor(Math.random() * 200000) + 100000,
          latency: Math.floor(Math.random() * 300) + 50,
          finality: Math.floor(Math.random() * 200) + 100,
          blockTime: 2 + Math.random() * 0.5,
          validatorCount: 50 + Math.floor(Math.random() * 50),
        }));

        setMetricsData(mockData);

        // Calculate percentiles
        const latencies = mockData.map((m) => m.latency).sort((a, b) => a - b);
        setLatencyPercentiles({
          p50: latencies[Math.floor(latencies.length * 0.5)],
          p95: latencies[Math.floor(latencies.length * 0.95)],
          p99: latencies[Math.floor(latencies.length * 0.99)],
          max: latencies[latencies.length - 1],
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load metrics'
        );
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [timeRange]);

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'TPS', 'Latency (ms)', 'Finality (ms)', 'Block Time', 'Validators'],
      ...metricsData.map((m) => [
        m.timestamp,
        m.tps,
        m.latency,
        m.finality,
        m.blockTime,
        m.validatorCount,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-${timeRange}-${Date.now()}.csv`;
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

  const avgTPS = Math.round(
    metricsData.reduce((sum, m) => sum + m.tps, 0) / metricsData.length
  );
  const avgLatency = Math.round(
    metricsData.reduce((sum, m) => sum + m.latency, 0) / metricsData.length
  );
  const avgFinality = Math.round(
    metricsData.reduce((sum, m) => sum + m.finality, 0) / metricsData.length
  );
  const avgBlockTime = (
    metricsData.reduce((sum, m) => sum + m.blockTime, 0) / metricsData.length
  ).toFixed(2);

  const metrics = [
    {
      label: 'Average TPS',
      value: avgTPS,
      unit: 'tx/s',
      trend: 12,
      status: 'good' as const,
    },
    {
      label: 'Avg Latency',
      value: avgLatency,
      unit: 'ms',
      trend: -8,
      status: 'good' as const,
    },
    {
      label: 'Avg Finality',
      value: avgFinality,
      unit: 'ms',
      trend: -5,
      status: 'good' as const,
    },
    {
      label: 'Block Time',
      value: avgBlockTime,
      unit: 's',
      trend: 0,
      status: 'good' as const,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Performance Metrics</Typography>
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
          {(['1h', '24h', '7d'] as const).map((range) => (
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

      {/* Metrics Overview */}
      <AnalyticsPanel metrics={metrics} />

      {/* Charts */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              TPS & Latency Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="tps"
                  fill="#8884d8"
                  name="TPS"
                  isAnimationActive={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="latency"
                  stroke="#82ca9d"
                  name="Latency (ms)"
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Finality Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="finality"
                  stroke="#ffc658"
                  name="Finality (ms)"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Validator Count
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="validatorCount"
                  stroke="#ff7c7c"
                  name="Active Validators"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Latency Analysis */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          {latencyPercentiles && (
            <LatencyHistogram percentiles={latencyPercentiles} />
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <FinilityIndicator
            finality={metricsData[metricsData.length - 1]?.finality || 0}
            target={100}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default PerformanceMetricsPage;
