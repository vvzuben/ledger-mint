import { NextPage } from 'next';
import { useEffect, useState } from 'react';

import styles from './countdown.module.css';
import Loader from './loader';

const Countdown: NextPage<{ date: Date }> = ({ date: countdownDate }) => {
  const calculateTimeLeft: () => {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  } = () => {
    const year = new Date().getFullYear();
    const difference = +countdownDate - +new Date();
    const timeLeft: {
      days?: number;
      hours?: number;
      minutes?: number;
      seconds?: number;
    } = {};

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<{
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  }>(calculateTimeLeft());
  const [year] = useState(new Date().getFullYear());

  const handleTimer = () => {
    setTimeLeft(calculateTimeLeft());
  };

  useEffect(() => {
    const newTimer = setInterval(handleTimer, 1000);

    return () => {
      if (newTimer) {
        clearInterval(newTimer);
      }
    };
  }, []);

  return (
    <div className={styles.countdown}>
      {timeLeft.seconds !== undefined && (
        <div className={styles.content}>
          <div className={styles.time}>
            <div className={styles.value}>{timeLeft.days.toString()}</div>
            <div className={styles.label}>Days</div>
          </div>
          <div className={styles.colon}>:</div>
          <div className={styles.time}>
            <div className={styles.value}>{timeLeft.hours.toString()}</div>
            <div className={styles.label}>Hours</div>
          </div>
          <div className={styles.colon}>:</div>
          <div className={styles.time}>
            <div className={styles.value}>{timeLeft.minutes.toString()}</div>
            <div className={styles.label}>Minutes</div>
          </div>
          <div className={styles.colon}>:</div>
          <div className={styles.time}>
            <div className={styles.value}>{timeLeft.seconds.toString()}</div>
            <div className={styles.label}>Seconds</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Countdown;
