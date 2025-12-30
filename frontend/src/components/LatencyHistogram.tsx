import { Paper, Typography, Stack, Box, LinearProgress } from '@mui/material';

interface LatencyPercentiles {
  p50: number;
  p95: number;
  p99: number;
  max: number;
}

interface LatencyHistogramProps {
  percentiles: LatencyPercentiles;
}

export const LatencyHistogram: React.FC<LatencyHistogramProps> = ({
  percentiles,
}) => {
  const getColor = (percentile: number, value: number) => {
    if (percentile === 50) return '#4caf50'; // Green
    if (percentile === 95) return '#ff9800'; // Orange
    if (percentile === 99) return '#f44336'; // Red
    return '#2196f3'; // Blue
  };

  const getLabel = (percentile: number) => {
    if (percentile === 50) return 'P50 (Median)';
    if (percentile === 95) return 'P95 (95th percentile)';
    if (percentile === 99) return 'P99 (99th percentile)';
    return 'Max';
  };

  const maxValue = percentiles.max;
  const data = [
    { percentile: 50, value: percentiles.p50, label: 'P50' },
    { percentile: 95, value: percentiles.p95, label: 'P95' },
    { percentile: 99, value: percentiles.p99, label: 'P99' },
    { percentile: 100, value: percentiles.max, label: 'MAX' },
  ];

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Latency Percentiles
      </Typography>

      <Stack spacing={3}>
        {data.map((item) => (
          <Box key={item.percentile}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{item.label}</Typography>
              <Typography variant="subtitle2">{item.value.toFixed(2)}ms</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(item.value / maxValue) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getColor(item.percentile, item.value),
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        ))}
      </Stack>

      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="caption" color="textSecondary">
          Latency distribution shows response times at different percentiles.
          Lower values indicate better performance.
        </Typography>
      </Box>
    </Paper>
  );
};

export default LatencyHistogram;
