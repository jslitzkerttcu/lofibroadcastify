import React from 'react';
import { Box, Button, Slider, Typography } from '@mui/material';

export default function AudioSettingsScreen({
  show,
  goBackFn,
  musicVolume,
  setMusicVolume,
  broadcastVolume,
  setBroadcastVolume,
}) {
  if (!show) return null;

  return (
    <Box sx={{ textAlign: 'center', marginTop: 4, color: 'white' }}>
      <h2>Audio Settings</h2>
      <Typography>Music Volume:</Typography>
      <Slider sx={{ color: 'white' }}
        value={musicVolume}
        onChange={(event, newValue) => setMusicVolume(newValue)}
        min={0}
        max={1}
        step={0.01}
        valueLabelDisplay="auto"
      />
      <Typography>Broadcast Volume:</Typography>
      <Slider sx={{ color: 'white' }}
        value={broadcastVolume}
        onChange={(event, newValue) => setBroadcastVolume(newValue)}
        min={0}
        max={1}
        step={0.01}
        valueLabelDisplay="auto"
      />
      <Button sx={{ color: 'white'}} onClick={goBackFn}>Back</Button>
    </Box>
  );
}
