import { useEffect, useRef } from 'react';
import { NextPage } from 'next';
import Swipe from 'swipejs';

import styles from './swiper.module.css';
import classNames from 'classnames';

const Swiper: NextPage<{
  onChange: (index: number) => void;
  stars: {
    id: number;
    certIndex: number;
    name: string;
    rarity: string;
    image: string;
  }[];
}> = ({ onChange, stars }) => {
  const swipeRef = useRef<HTMLDivElement>();

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      (window as any).mySwipe.prev();
    }
    if (e.key === 'ArrowRight') {
      (window as any).mySwipe.next();
    }
  };

  useEffect(() => {
    if (swipeRef.current) {
      if ((window as any).mySwipe) {
        delete (window as any).mySwipe;
      }

      (window as any).mySwipe = new Swipe(swipeRef.current, {
        startSlide: 0,
        speed: 400,
        draggable: true,
        continuous: true,
        disableScroll: false,
        stopPropagation: false,
        ignore: '.scroller',
        callback: function (index, elem, dir) {
          onChange(index);
        },
        transitionEnd: function (index, elem) {},
      });
    }
  }, [swipeRef]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div className="swipe" ref={swipeRef}>
      <div className="swipe-wrap">
        {stars.map((star) => (
          <div key={star.id}>
            <div
              className={classNames(
                styles.frame,
                !star.image ? styles.empty : null,
              )}
            >
              {!star.image && (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src="videos/star-landscape.mp4"
                />
              )}
              {star.image ? (
                <img src={star.image} />
              ) : (
                <img src={`/certificates/Data Set ${star.certIndex}.png`} />
              )}
            </div>
            <div className={styles.details}>
              <h2 className={styles.starName}>{star.name}</h2>
              {!star.image && (
                <p>
                  Your star image is rendering. Please check back in 2-4 hours.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Swiper;
