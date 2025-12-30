import { Grid, Paper, Typography, Box, LinearProgress } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

interface MetricData {
  label: string;
  value: number | string;
  unit: string;
  trend: number;
  status: 'good' | 'warning' | 'critical';
}

interface AnalyticsPanelProps {
  metrics: MetricData[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'good':
      return '#4caf50';
    case 'warning':
      return '#ff9800';
    case 'critical':
      return '#f44336';
    default:
      return '#2196f3';
  }
};

const getTrendIcon = (trend: number) => {
  if (trend > 0) {
    return <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 20 }} />;
  } else if (trend < 0) {
    return <TrendingDownIcon sx={{ color: '#f44336', fontSize: 20 }} />;
  }
  return null;
};

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ metrics }) => {
  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            sx={{
              p: 3,
              borderTop: `4px solid ${getStatusColor(metric.status)}`,
            }}
          >
            <Typography color="textSecondary" variant="caption" gutterBottom>
              {metric.label}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
              <Typography variant="h5">
                {typeof metric.value === 'number'
                  ? metric.value.toLocaleString()
                  : metric.value}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {metric.unit}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getTrendIcon(metric.trend)}
              <Typography
                variant="caption"
                sx={{
                  color:
                    metric.trend > 0
                      ? '#4caf50'
                      : metric.trend < 0
                      ? '#f44336'
                      : '#999',
                }}
              >
                {metric.trend > 0 ? '+' : ''}
                {metric.trend}%
              </Typography>
              <Typography variant="caption" color="textSecondary">
                vs last period
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={Math.min(Math.abs(metric.trend) * 10, 100)}
              sx={{ mt: 1 }}
            />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default AnalyticsPanel;
