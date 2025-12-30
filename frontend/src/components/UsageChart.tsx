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
import { Paper, Typography, Box, Button, Stack } from '@mui/material';
import { useState } from 'react';

interface UsageData {
  timestamp: string;
  usage: number;
  limit: number;
  percentage: number;
}

interface UsageChartProps {
  data: UsageData[];
  title: string;
  metric?: 'line' | 'area' | 'bar';
}

export const UsageChart: React.FC<UsageChartProps> = ({
  data,
  title,
  metric = 'area',
}) => {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>(metric);

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="usage"
              stroke="#8884d8"
              name="Usage"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="limit"
              stroke="#82ca9d"
              name="Limit"
              isAnimationActive={false}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="usage"
              fill="#8884d8"
              stroke="#8884d8"
              name="Usage"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="limit"
              fill="#82ca9d"
              stroke="#82ca9d"
              name="Limit"
              isAnimationActive={false}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="usage" fill="#8884d8" name="Usage" />
            <Bar dataKey="limit" fill="#82ca9d" name="Limit" />
          </BarChart>
        );
      default:
        return null;
    }
  };

  const maxUsage = Math.max(...data.map((d) => d.usage));
  const avgUsage =
    data.reduce((sum, d) => sum + d.usage, 0) / data.length;
  const utilizationRate =
    ((avgUsage / data[0]?.limit) * 100).toFixed(1);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Stack direction="row" spacing={3}>
          <Box>
            <Typography color="textSecondary" variant="caption">
              Current Usage
            </Typography>
            <Typography variant="body2">
              {data[data.length - 1]?.usage.toLocaleString()} / {data[0]?.limit.toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography color="textSecondary" variant="caption">
              Utilization
            </Typography>
            <Typography variant="body2">{utilizationRate}%</Typography>
          </Box>
          <Box>
            <Typography color="textSecondary" variant="caption">
              Peak Usage
            </Typography>
            <Typography variant="body2">{maxUsage.toLocaleString()}</Typography>
          </Box>
        </Stack>
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>

      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        <Button
          size="small"
          variant={chartType === 'line' ? 'contained' : 'outlined'}
          onClick={() => setChartType('line')}
        >
          Line
        </Button>
        <Button
          size="small"
          variant={chartType === 'area' ? 'contained' : 'outlined'}
          onClick={() => setChartType('area')}
        >
          Area
        </Button>
        <Button
          size="small"
          variant={chartType === 'bar' ? 'contained' : 'outlined'}
          onClick={() => setChartType('bar')}
        >
          Bar
        </Button>
      </Stack>
    </Paper>
  );
};

export default UsageChart;
