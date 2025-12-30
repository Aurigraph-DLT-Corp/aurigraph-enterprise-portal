import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface Plan {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  description: string;
  features: string[];
  popular: boolean;
  limits: {
    transactions: number;
    apiCalls: number;
    storage: number;
    users: number;
  };
}

export const PlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'comparison'>('cards');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        // Mock plans data
        const mockPlans: Plan[] = [
          {
            id: 'starter',
            name: 'Starter',
            price: 29,
            billing: 'monthly',
            description: 'Perfect for getting started',
            popular: false,
            features: [
              'Up to 100K transactions/month',
              'Basic API access',
              'Email support',
              '5GB storage',
              'Single user',
            ],
            limits: {
              transactions: 100000,
              apiCalls: 1000000,
              storage: 5,
              users: 1,
            },
          },
          {
            id: 'professional',
            name: 'Professional',
            price: 99,
            billing: 'monthly',
            description: 'For growing businesses',
            popular: true,
            features: [
              'Up to 1M transactions/month',
              'Advanced API access',
              'Priority support',
              '100GB storage',
              'Up to 10 users',
              'Custom integrations',
              'Advanced analytics',
            ],
            limits: {
              transactions: 1000000,
              apiCalls: 10000000,
              storage: 100,
              users: 10,
            },
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            price: 499,
            billing: 'monthly',
            description: 'For large-scale operations',
            popular: false,
            features: [
              'Unlimited transactions',
              'Dedicated API access',
              '24/7 phone support',
              'Unlimited storage',
              'Unlimited users',
              'Custom integrations',
              'Advanced analytics',
              'SLA guarantee',
              'Dedicated account manager',
            ],
            limits: {
              transactions: Infinity,
              apiCalls: Infinity,
              storage: Infinity,
              users: Infinity,
            },
          },
        ];

        // Adjust pricing for yearly billing
        if (billingCycle === 'yearly') {
          mockPlans.forEach((plan) => {
            plan.price = Math.floor(plan.price * 12 * 0.8); // 20% discount
          });
        }

        setPlans(mockPlans);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load plans'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [billingCycle]);

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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Plans & Pricing
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 3 }}>
          Choose the perfect plan for your needs
        </Typography>

        {/* View Mode Toggle */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant={viewMode === 'cards' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('cards')}
          >
            Card View
          </Button>
          <Button
            variant={viewMode === 'comparison' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('comparison')}
          >
            Compare
          </Button>
        </Box>

        {/* Billing Cycle Toggle */}
        <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
          <Button
            variant={billingCycle === 'monthly' ? 'contained' : 'outlined'}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === 'yearly' ? 'contained' : 'outlined'}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly (20% off)
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Card View */}
      {viewMode === 'cards' && (
        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: plan.popular ? '2px solid #1976d2' : '1px solid #e0e0e0',
                }}
              >
                {plan.popular && (
                  <Chip
                    label="Popular"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                    }}
                  />
                )}

                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h5" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography color="textSecondary" sx={{ mb: 2 }}>
                    {plan.description}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h4">
                      ${plan.price}
                      <Typography component="span" variant="body1" color="textSecondary">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </Typography>
                    </Typography>
                  </Box>

                  <List dense>
                    {plan.features.map((feature, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>

                <CardActions>
                  <Button
                    fullWidth
                    variant={plan.popular ? 'contained' : 'outlined'}
                  >
                    Choose Plan
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Comparison View */}
      {viewMode === 'comparison' && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Feature</TableCell>
                {plans.map((plan) => (
                  <TableCell key={plan.id} align="center">
                    <Typography variant="subtitle1">{plan.name}</Typography>
                    <Typography variant="h6">
                      ${plan.price}
                      <Typography component="span" variant="caption">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </Typography>
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Transactions/month</TableCell>
                {plans.map((plan) => (
                  <TableCell key={plan.id} align="center">
                    {plan.limits.transactions === Infinity
                      ? 'Unlimited'
                      : plan.limits.transactions.toLocaleString()}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Storage</TableCell>
                {plans.map((plan) => (
                  <TableCell key={plan.id} align="center">
                    {plan.limits.storage === Infinity
                      ? 'Unlimited'
                      : `${plan.limits.storage}GB`}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Users</TableCell>
                {plans.map((plan) => (
                  <TableCell key={plan.id} align="center">
                    {plan.limits.users === Infinity
                      ? 'Unlimited'
                      : plan.limits.users}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Support</TableCell>
                {plans.map((plan) => (
                  <TableCell key={plan.id} align="center">
                    {plan.id === 'starter'
                      ? 'Email'
                      : plan.id === 'professional'
                      ? 'Priority'
                      : '24/7 Phone'}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default PlansPage;
