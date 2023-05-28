import { NextPage } from 'next';
import { useEffect, useState } from 'react';

import styles from './features.module.css';

const Features = () => {
  const features = [
    {
      title: 'Profit Sharing',
      description:
        'All star holders receive 50% of all $METIS profits from secondary market commissions.',
    },
    {
      title: 'Explorer Airdrop',
      description:
        'Explorer NFTs are avatars. They are required to access the metaverse. Star holders with 5 or more stars will receive 1 Explorer NFT for every 5 stars they own.',
    },
    {
      title: 'Weekly Airdrop',
      description:
        'All star holders are entered in a weekly drawing for a Notable, Rare, Ultra Rare or Legendary Star NFT. No Standards, the most common stars.',
    },
    {
      title: 'Star Map',
      description:
        'Your stars and constellations are viewable on a 3D map. VR/AR mode coming soon.',
    },
    {
      title: 'Metaverse',
      description:
        'All StarLedger NFTs will be usable in the StarLedger Metaverse. Hop aboard a spaceship and show off your collection.',
    },
    {
      title: 'Marketplace',
      description:
        'Buy and sell stars and other StarLedger NFTs in the StarLedger Marketplace.',
    },
  ];

  const [featureIndex, setFeatureIndex] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const handleFeatureClick = (i: number) => {
    if (timer) {
      clearTimeout(timer);
    }
    setFeatureIndex(i);
  };

  const nextFeature = () => {
    if (timer) {
      clearTimeout(timer);
    }
    if (featureIndex >= features.length - 1) {
      setFeatureIndex(0);
    } else {
      setFeatureIndex(featureIndex + 1);
    }
  };

  const previousFeature = () => {
    if (timer) {
      clearTimeout(timer);
    }
    if (featureIndex === 0) {
      setFeatureIndex(features.length - 1);
    } else {
      setFeatureIndex(featureIndex - 1);
    }
  };

  useEffect(() => {
    const newTimer = setTimeout(nextFeature, 10000);
    setTimer(newTimer);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [featureIndex]);

  return (
    <div className={styles.features}>
      <ul className={styles.featureList}>
        {features.map((feature, i) => (
          <li>
            <button
              className={featureIndex === i ? styles.selected : null}
              onClick={() => handleFeatureClick(i)}
            >
              {feature.title}
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.container}>
        <h3>{features[featureIndex].title}</h3>
        <div className={styles.content}>
          <button onClick={previousFeature}>&lt;</button>
          <p>{features[featureIndex].description}</p>
          <button onClick={nextFeature}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default Features;
