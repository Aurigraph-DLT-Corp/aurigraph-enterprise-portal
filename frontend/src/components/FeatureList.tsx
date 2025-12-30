import { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Slider,
  Stack,
} from '@mui/material';

interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
}

interface FeatureListProps {
  features: Feature[];
  onToggle: (featureId: string, enabled: boolean) => void;
  onRollout: (featureId: string, percentage: number) => void;
}

export const FeatureList: React.FC<FeatureListProps> = ({
  features,
  onToggle,
  onRollout,
}) => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rolloutValue, setRolloutValue] = useState(0);

  const handleFeatureClick = (feature: Feature) => {
    setSelectedFeature(feature);
    setRolloutValue(feature.rolloutPercentage);
    setOpenDialog(true);
  };

  const handleRolloutChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setRolloutValue(value[0]);
    } else {
      setRolloutValue(value);
    }
  };

  const handleSaveRollout = () => {
    if (selectedFeature) {
      onRollout(selectedFeature.id, rolloutValue);
      setOpenDialog(false);
    }
  };

  return (
    <>
      <List>
        {features.map((feature) => (
          <ListItem
            key={feature.id}
            button
            onClick={() => handleFeatureClick(feature)}
            sx={{ borderBottom: '1px solid #eee' }}
          >
            <ListItemText
              primary={feature.name}
              secondary={feature.description}
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={feature.enabled}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggle(feature.id, e.target.checked);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>
          Configure Feature: {selectedFeature?.name}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box>
              <Typography gutterBottom>
                Rollout Percentage: {rolloutValue}%
              </Typography>
              <Slider
                value={rolloutValue}
                onChange={handleRolloutChange}
                min={0}
                max={100}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' },
                ]}
              />
              <Typography variant="caption" color="textSecondary">
                Control the percentage of users who see this feature
              </Typography>
            </Box>

            {selectedFeature && (
              <Box>
                <Typography variant="subtitle2">Feature Details</Typography>
                <Typography variant="body2" color="textSecondary">
                  ID: {selectedFeature.id}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {selectedFeature.enabled ? 'Enabled' : 'Disabled'}
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRollout} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FeatureList;
