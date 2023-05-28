import classNames from 'classnames';
import { NextPage } from 'next';

import styles from './loader.module.css';

const Loader: NextPage<{ color: 'black' | 'white'; size?: number }> = ({
  color = 'black',
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.profileMainLoader}>
        <div className={styles.loader}>
          <svg className={styles.circularLoader} viewBox="25 25 50 50">
            <circle
              className={classNames(styles.loaderPath, styles[color])}
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke={color === 'black' ? '#666' : '#CCC'}
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Loader;
