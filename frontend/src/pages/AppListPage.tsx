import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAppManagement } from '../hooks/useAppManagement';
import { AppCard } from '../components/AppCard';

interface App {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  transactions: number;
  tps: number;
}

export const AppListPage: React.FC = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'inactive' | 'pending'
  >('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'tps'>('name');
  const [openDialog, setOpenDialog] = useState(false);
  const [newAppName, setNewAppName] = useState('');

  const { fetchApps, createApp, deleteApp } = useAppManagement();

  useEffect(() => {
    const loadApps = async () => {
      try {
        setLoading(true);
        const data = await fetchApps();
        setApps(data);
        applyFilters(data, searchTerm, filterStatus, sortBy);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load apps'
        );
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, [fetchApps]);

  const applyFilters = (
    data: App[],
    search: string,
    status: string,
    sort: string
  ) => {
    let filtered = data;

    // Apply search filter
    if (search) {
      filtered = filtered.filter((app) =>
        app.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter((app) => app.status === status);
    }

    // Apply sorting
    switch (sort) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'created':
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
        break;
      case 'tps':
        filtered.sort((a, b) => b.tps - a.tps);
        break;
    }

    setFilteredApps(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(apps, value, filterStatus, sortBy);
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status as any);
    applyFilters(apps, searchTerm, status, sortBy);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort as any);
    applyFilters(apps, searchTerm, filterStatus, sort);
  };

  const handleCreateApp = async () => {
    if (!newAppName.trim()) {
      return;
    }

    try {
      const newApp = await createApp({ name: newAppName });
      setApps([...apps, newApp]);
      applyFilters([...apps, newApp], searchTerm, filterStatus, sortBy);
      setNewAppName('');
      setOpenDialog(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create app'
      );
    }
  };

  const handleDeleteApp = async (appId: string) => {
    if (!confirm('Are you sure you want to delete this app?')) {
      return;
    }

    try {
      await deleteApp(appId);
      const updated = apps.filter((app) => app.id !== appId);
      setApps(updated);
      applyFilters(updated, searchTerm, filterStatus, sortBy);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete app'
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Applications
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Filters and Actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search apps..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              size="small"
              sx={{ flex: 1, minWidth: 200 }}
            />
            <Button variant="contained" onClick={() => setOpenDialog(true)}>
              Create New App
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ alignSelf: 'center' }}>Filter:</Typography>
            {['all', 'active', 'inactive', 'pending'].map((status) => (
              <Chip
                key={status}
                label={status}
                onClick={() => handleFilterChange(status)}
                variant={
                  filterStatus === status ? 'filled' : 'outlined'
                }
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ alignSelf: 'center' }}>Sort:</Typography>
            {['name', 'created', 'tps'].map((sort) => (
              <Chip
                key={sort}
                label={sort}
                onClick={() => handleSortChange(sort)}
                variant={sortBy === sort ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Stack>
      </Paper>

      {/* Apps Grid */}
      {filteredApps.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} onDelete={handleDeleteApp} />
          ))}
        </Box>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="textSecondary">
            No apps found. Create one to get started.
          </Typography>
        </Paper>
      )}

      {/* Create App Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Application</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Application Name"
            fullWidth
            value={newAppName}
            onChange={(e) => setNewAppName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateApp();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateApp} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppListPage;
