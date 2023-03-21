/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import AudioWrapper from './AudioWrapper';
import AudioSettingsScreen from './AudioSettingsScreen';
import { Container, Box, IconButton, Typography } from '@mui/material';
import './App.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { VolumeUp, SkipNext } from '@mui/icons-material';


const SCREENS = {
  AUDIO_PLAYER: 'audio_player',
  AUDIO_SETTINGS: 'audio_settings',
};

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.AUDIO_PLAYER);
  const [play, setPlay] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [broadcastVolume, setBroadcastVolume] = useState(0.5);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [trackTitle, setTrackTitle] = useState('');

  useEffect(() => {
    fetch('./assets/lofimp3.m3u')
      .then((response) => response.text())
      .then((data) => {
        const urls = data.split('\n').filter((line) => line.trim() !== '' && !line.startsWith('#'));
        setPlaylist(urls);
      });
  }, []);

  const handleTrackEnd = () => {
    setCurrentTrack((prevTrack) => (prevTrack + 1) % playlist.length);
  };

  const handleSkipTrack = () => {
    setCurrentTrack((prevTrack) => (prevTrack + 1) % playlist.length);
    setTrackTitle(''); // Reset the track title when skipping tracks
  };

  const handleTitleUpdate = (title) => {
    setTrackTitle(title);
  };

  return (
    <div className="App">
      <div className="background-wrapper"></div>
      <div className="background-visual"></div>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', marginTop: 4, position: 'relative' }}>
          <Typography variant="h2" component="h1" className="site-title">
            Lofi Broadcastify
          </Typography>
          {currentScreen === SCREENS.AUDIO_PLAYER && (
            <div className="sidebar-action">
              <IconButton onClick={() => setCurrentScreen(SCREENS.AUDIO_SETTINGS)}>
                <VolumeUp />
              </IconButton>
              <Typography className="settings-label">Settings</Typography>
            </div>
          )}
          {playlist.length > 0 && (
            <AudioWrapper
              key={currentTrack}
              url={playlist[currentTrack]}
              play={play}
              volume={musicVolume}
              onEnded={handleTrackEnd}
              onTitleChange={handleTitleUpdate}
            />
          )}
          <AudioWrapper
            url="http://broadcastify.cdnstream1.com/39207"
            play={play}
            volume={broadcastVolume}
          />
          {currentScreen === SCREENS.AUDIO_PLAYER && (
            <>
              <Typography variant="h6" className="track-title">Lofi Track: {trackTitle}</Typography>
              <Box
                component="span"
                className="play-button-wrapper"
                onClick={() => setPlay(!play)}
              >
                <FontAwesomeIcon
                  icon={play ? faPause : faPlay}
                  size="2x"
                  className="play-icon"
                />
              </Box>
              <IconButton onClick={handleSkipTrack}>
                <SkipNext />
              </IconButton>
            </>
          )}
          <AudioSettingsScreen
            show={currentScreen === SCREENS.AUDIO_SETTINGS}
            goBackFn={() => setCurrentScreen(SCREENS.AUDIO_PLAYER)}
            musicVolume={musicVolume}
            setMusicVolume={setMusicVolume}
            broadcastVolume={broadcastVolume}
            setBroadcastVolume={setBroadcastVolume}
          />
        </Box>
      </Container>
    </div>
  );
}

export default App;
