import { NextPage } from 'next';
import { useEffect, useState } from 'react';

import Button from '../components/button';
import Layout from '../components/layout';

import { Mint } from '../views/mint';

import styles from './index.module.css';

const IndexPageContent: NextPage = () => {
  const [step, setStep] = useState(0);

  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState('');

  const handleConnect = (connectedAccount: string) => {
    setAccount(connectedAccount);
    setChainId((window as any).ethereum.chainId);
    setStep(1);
  };

  const handleHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
  };

  const handleNetwork = async () => {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: process.env.CHAIN_ID }],
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (typeof (window as any).ethereum !== 'undefined') {
      (window as any).ethereum.on('accountsChanged', async () => {
        window.location.reload();
      });

      (window as any).ethereum.on('networkChanged', async () => {
        setChainId((window as any).ethereum.chainId);
      });
    }

    window.addEventListener('resize', handleHeight);
    handleHeight();

    return () => {
      window.removeEventListener('resize', handleHeight);
    };
  }, []);

  if (chainId?.length > 0 && chainId !== process.env.CHAIN_ID) {
    return (
      <div className={styles.connectionError}>
        <h2>Wrong Network</h2>
        <p>
          Please switch to the <b>Ethereum Mainnet</b> network to continue.
        </p>
        <Button color="primary" onClick={() => handleNetwork()}>
          Switch <b>Network</b>
        </Button>
      </div>
    );
  }

  return <Mint />;
};

const IndexPage: NextPage = () => {
  return (
    <Layout>
      <IndexPageContent />
    </Layout>
  );
};

export default IndexPage;
