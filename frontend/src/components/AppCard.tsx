import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

interface AppCardProps {
  app: {
    id: string;
    name: string;
    status: 'active' | 'inactive' | 'pending';
    createdAt: string;
    transactions: number;
    tps: number;
  };
  onDelete: (appId: string) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div">
            {app.name}
          </Typography>
          <Chip
            label={app.status}
            color={getStatusColor(app.status)}
            size="small"
            variant="outlined"
          />
        </Box>

        <Stack spacing={1.5}>
          <Box>
            <Typography color="textSecondary" variant="caption">
              Created
            </Typography>
            <Typography variant="body2">
              {new Date(app.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Box>
            <Typography color="textSecondary" variant="caption">
              Transactions
            </Typography>
            <Typography variant="body2">
              {app.transactions.toLocaleString()}
            </Typography>
          </Box>

          <Box>
            <Typography color="textSecondary" variant="caption">
              TPS
            </Typography>
            <Typography variant="body2">
              {app.tps.toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button size="small" variant="outlined">
          View Details
        </Button>
        <Box>
          <IconButton size="small" color="primary">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(app.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default AppCard;
