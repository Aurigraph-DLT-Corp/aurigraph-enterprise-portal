import { Paper, Typography, Box, CircularProgress, Stack, Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface FinilityIndicatorProps {
  finality: number;
  target: number;
}

export const FinilityIndicator: React.FC<FinilityIndicatorProps> = ({
  finality,
  target,
}) => {
  const percentage = Math.min((target / finality) * 100, 100);
  const isGood = finality <= target * 1.2;
  const status = finality <= target ? 'excellent' : isGood ? 'good' : 'warning';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return { color: '#4caf50', label: 'Excellent' };
      case 'good':
        return { color: '#8bc34a', label: 'Good' };
      case 'warning':
        return { color: '#ff9800', label: 'Warning' };
      default:
        return { color: '#9e9e9e', label: 'Unknown' };
    }
  };

  const statusInfo = getStatusColor(status);

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Block Finality
      </Typography>

      <Stack spacing={3} sx={{ alignItems: 'center', mt: 3 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            size={150}
            sx={{
              color: statusInfo.color,
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h4">{finality}ms</Typography>
            <Typography variant="caption" color="textSecondary">
              Target: {target}ms
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
            {status === 'excellent' || status === 'good' ? (
              <CheckCircleIcon sx={{ color: statusInfo.color }} />
            ) : (
              <WarningIcon sx={{ color: statusInfo.color }} />
            )}
            <Typography variant="subtitle1" sx={{ color: statusInfo.color }}>
              {statusInfo.label}
            </Typography>
          </Box>

          <Typography variant="body2" color="textSecondary">
            Block confirmation time is{' '}
            {((finality / target - 1) * 100).toFixed(0)}%
            {finality > target ? ' above' : ' below'} target
          </Typography>
        </Box>

        <Box sx={{ width: '100%', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="caption" color="textSecondary">
            Finality measures how quickly blocks are confirmed and finalized
            on the blockchain. Lower values mean faster confirmation.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default FinilityIndicator;
