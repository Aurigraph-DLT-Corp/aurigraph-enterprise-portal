import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Check as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface Subscription {
  id: string;
  planName: string;
  planId: string;
  status: 'active' | 'canceled' | 'paused';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  startDate: string;
  renewalDate: string;
  features: string[];
}

interface UpgradePath {
  planId: string;
  planName: string;
  price: number;
  priceIncrease: number;
  prorationCredit: number;
}

export const SubscriptionPage: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [upgradePaths, setUpgradePaths] = useState<UpgradePath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState<UpgradePath | null>(null);

  useEffect(() => {
    const loadSubscriptionData = async () => {
      try {
        setLoading(true);

        // Mock current subscription
        const mockSubscription: Subscription = {
          id: 'sub-123456',
          planName: 'Professional',
          planId: 'professional',
          status: 'active',
          price: 99,
          billingCycle: 'monthly',
          startDate: '2024-01-15',
          renewalDate: '2025-01-15',
          features: [
            'Up to 1M transactions/month',
            'Advanced API access',
            'Priority support',
            '100GB storage',
            'Up to 10 users',
            'Custom integrations',
            'Advanced analytics',
          ],
        };

        // Mock upgrade paths
        const mockUpgradePaths: UpgradePath[] = [
          {
            planId: 'enterprise',
            planName: 'Enterprise',
            price: 499,
            priceIncrease: 400,
            prorationCredit: 33, // ~1 month of difference
          },
        ];

        setSubscription(mockSubscription);
        setUpgradePaths(mockUpgradePaths);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load subscription'
        );
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionData();
  }, []);

  const handleUpgrade = () => {
    setOpenUpgradeDialog(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedUpgrade) return;
    try {
      // API call to upgrade subscription
      setOpenUpgradeDialog(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to upgrade subscription'
      );
    }
  };

  const handleCancel = () => {
    setOpenCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    try {
      // API call to cancel subscription
      if (subscription) {
        setSubscription({ ...subscription, status: 'canceled' });
      }
      setOpenCancelDialog(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to cancel subscription'
      );
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

  if (!subscription) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">No active subscription</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Subscription Management
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Current Subscription Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h5" gutterBottom>
                {subscription.planName}
              </Typography>
              <Typography color="textSecondary">
                ${subscription.price}/{subscription.billingCycle === 'monthly' ? 'month' : 'year'}
              </Typography>
            </Box>
            <Box>
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  backgroundColor:
                    subscription.status === 'active'
                      ? '#c8e6c9'
                      : '#ffccbc',
                  color:
                    subscription.status === 'active'
                      ? '#2e7d32'
                      : '#d84315',
                  borderRadius: 1,
                  textAlign: 'center',
                }}
              >
                <Typography variant="subtitle2">
                  {subscription.status.toUpperCase()}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Typography color="textSecondary" variant="caption">
                Subscription Started
              </Typography>
              <Typography>{subscription.startDate}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography color="textSecondary" variant="caption">
                Next Renewal
              </Typography>
              <Typography>{subscription.renewalDate}</Typography>
            </Grid>
          </Grid>

          <Typography variant="subtitle2" gutterBottom>
            Included Features
          </Typography>
          <List dense>
            {subscription.features.map((feature, idx) => (
              <ListItem key={idx}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleUpgrade}
              disabled={upgradePaths.length === 0}
            >
              Upgrade Plan
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancel}
              disabled={subscription.status !== 'active'}
            >
              Cancel Subscription
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Upgrade Dialog */}
      <Dialog
        open={openUpgradeDialog}
        onClose={() => setOpenUpgradeDialog(false)}
        fullWidth
      >
        <DialogTitle>Upgrade Your Plan</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Choose the plan you want to upgrade to:
          </Typography>
          <Stack spacing={2}>
            {upgradePaths.map((path) => (
              <Card
                key={path.planId}
                variant={
                  selectedUpgrade?.planId === path.planId
                    ? 'elevation'
                    : 'outlined'
                }
                sx={{
                  cursor: 'pointer',
                  border:
                    selectedUpgrade?.planId === path.planId
                      ? '2px solid #1976d2'
                      : '1px solid #e0e0e0',
                  p: 2,
                }}
                onClick={() => setSelectedUpgrade(path)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6">{path.planName}</Typography>
                    <Typography color="textSecondary" variant="body2">
                      ${path.price}/month
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle2">
                      +${path.priceIncrease}/month
                    </Typography>
                    <Typography color="textSecondary" variant="caption">
                      Credit: -${path.prorationCredit}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpgradeDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmUpgrade}
            variant="contained"
            disabled={!selectedUpgrade}
          >
            Upgrade
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
      >
        <DialogTitle>Cancel Subscription?</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Canceling your subscription will end your access to all features
            at the end of your current billing period.
          </Alert>
          <Typography>
            Your subscription will remain active until{' '}
            <strong>{subscription.renewalDate}</strong>.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>
            Keep Subscription
          </Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
          >
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionPage;
