// src/components/Playlist.jsx

import React from 'react';
import useAudioStore from './audioStore';
import { playlist } from '../config/audioConfig';

const Playlist = () => {
  const { currentTrack, setTrack, isPlaying } = useAudioStore();

  return (
    <div className="playlist">
      {playlist.map((track, index) => (
        <div
          key={track.id}
          className={`playlist-item ${currentTrack === index ? 'active' : ''}`}
          onClick={() => setTrack(index)}
        >
          <span className="track-title">{track.title}</span>
          {track.artist && <span className="track-artist">{track.artist}</span>}
          {track.duration && <span className="track-duration">{track.duration}</span>}
        </div>
      ))}
    </div>
  );
};

export default Playlist;