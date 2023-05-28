import { NextPage } from 'next';

import styles from './social.module.css';

const Social: NextPage<{}> = () => {
  return (
    <div className={styles.social}>
      <a
        className={styles.opensea}
        href="https://opensea.io/collection/starledger"
        rel="noreferrer noopener"
        target="_blank"
      />
      <a
        className={styles.etherscan}
        href="https://etherscan.io/address/0x690663f865dd2d3271d931b5f94fc2dbe302bbfe"
        rel="noreferrer noopener"
        target="_blank"
      />
      <a
        className={styles.twitter}
        href="https://twitter.com/StarLedgerNFT"
        rel="noreferrer noopener"
        target="_blank"
      />
      <a
        className={styles.discord}
        href="https://discord.gg/starledger"
        rel="noreferrer noopener"
        target="_blank"
      />
    </div>
  );
};

export default Social;
