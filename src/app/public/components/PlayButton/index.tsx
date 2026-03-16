// components/VideoPlayButton/index.tsx
import React from 'react';
import Link from 'next/link';
import styles from './PlayButton.module.scss';

type VideoPlayButtonProps = {
  href: string;
};

const VideoPlayButton = ({ href }: VideoPlayButtonProps) => {
  return (
    <Link href={href}>
      <div id="play-video" className={styles.videoPlayButton}>
        <span></span>
      </div>
    </Link>
  );
};

export default VideoPlayButton;
