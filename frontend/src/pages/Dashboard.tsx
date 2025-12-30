import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
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
} from 'recharts';
import { useAppManagement } from '../hooks/useAppManagement';

interface DashboardStats {
  totalApps: number;
  activeApps: number;
  totalTransactions: number;
  averageTPS: number;
  systemHealth: number;
  uptime: number;
}

interface ChartData {
  timestamp: string;
  tps: number;
  latency: number;
  active: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchApps } = useAppManagement();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [appsResponse] = await Promise.all([fetchApps()]);

        // Calculate statistics
        const totalApps = appsResponse.length;
        const activeApps = appsResponse.filter(
          (app: any) => app.status === 'active'
        ).length;

        setStats({
          totalApps,
          activeApps,
          totalTransactions: Math.floor(Math.random() * 1000000),
          averageTPS: Math.floor(Math.random() * 100000) + 50000,
          systemHealth: 99.9,
          uptime: 99.95,
        });

        // Generate mock chart data
        const mockData: ChartData[] = Array.from({ length: 24 }, (_, i) => ({
          timestamp: `${i}:00`,
          tps: Math.floor(Math.random() * 200000) + 50000,
          latency: Math.floor(Math.random() * 500) + 50,
          active: Math.floor(Math.random() * 100) + 20,
        }));

        setChartData(mockData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load dashboard data'
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchApps]);

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
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography color="textSecondary" gutterBottom>
              Total Apps
            </Typography>
            <Typography variant="h5">{stats?.totalApps}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography color="textSecondary" gutterBottom>
              Active Apps
            </Typography>
            <Typography variant="h5">{stats?.activeApps}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography color="textSecondary" gutterBottom>
              Average TPS
            </Typography>
            <Typography variant="h5">
              {(stats?.averageTPS ?? 0).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography color="textSecondary" gutterBottom>
              System Health
            </Typography>
            <Typography variant="h5">{stats?.systemHealth}%</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              TPS Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tps"
                  stroke="#8884d8"
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
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="latency"
                  fill="#82ca9d"
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

export default Dashboard;
