import React, { useEffect, useRef } from 'react';
import * as mm from 'music-metadata-browser';

function AudioWrapper({ url, play, volume, onEnded, onTitleChange }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (play) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [play]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = url;
    }
  }, [url]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(url);
        const reader = response.body.getReader();
        const result = await reader.read();
        const metadata = await mm.parseBlob(new Blob([result.value.buffer]));
        if (metadata && metadata.common && metadata.common.title) {
          onTitleChange(metadata.common.title);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    if (onTitleChange) {
      fetchMetadata();
    }
  }, [url, onTitleChange]);

  return (
    <audio
      ref={audioRef}
      onEnded={onEnded}
      onCanPlay={() => {
        if (play) {
          audioRef.current.play();
        }
      }}
    ></audio>
  );
}

export default AudioWrapper;
