import WalletConnectProvider from '@walletconnect/web3-provider';
import classNames from 'classnames';
import { providers } from 'ethers';
import { NextPage } from 'next';
import { useCallback, useEffect, useRef, useState } from 'react';
import Web3Modal from 'web3modal';
import { useModal } from '../contexts/modal';
import { usePopover } from '../contexts/popover';
import { useUser } from '../contexts/user';
import Button from './button';

import styles from './header.module.scss';

const Header: NextPage<{
  appName: string;
  bgColor?: 'black' | 'transparent';
}> = ({ appName, bgColor }) => {
  const modalContext = useModal();
  const popoverContext = usePopover();
  const userContext = useUser();

  const logoButtonRef = useRef();
  const [myAddress, setMyAddress] = useState('');

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const INFURA_ID = '637c48b6a85d4c64b1f1ad6ae4a34f32';

  //  Create Web3

  const handleAvatarClick = (e: React.MouseEvent) => {
    popoverContext.setTitle(null);
    popoverContext.setContent(
      <ul>
        <li>
          <a href="/logout">Logout</a>
        </li>
      </ul>,
    );
    popoverContext.setTarget(e.target as HTMLElement);
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsMenuOpen(false);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    popoverContext.setTitle(null);
    popoverContext.setContent(
      <ul>
        <li>
          <span>Mint</span>
        </li>
        <li>
          <a href="https://map.starledger.org">Map</a>
        </li>
        <li>
          <a href="https://news.starledger.org">News</a>
        </li>
        <li>
          <a href="https://member.starledger.org">Member</a>
        </li>
        <li>
          <a href="https://starledger.org">Website</a>
        </li>
      </ul>,
    );
    popoverContext.setTarget(logoButtonRef.current);
  };

  const handleNetworkError = () => {
    modalContext.setContent(
      <>
        <p>
          Switch to the <b>Metis Andromeda</b> network.
        </p>
        <Button color="primary" onClick={() => handleSwitchNetwork()}>
          {userContext.isSwitchingNetwork ? 'Waiting...' : 'Switch'}
        </Button>
      </>,
    );
    modalContext.setTitle('Invalid Network');
  };

  const handleClickConnect = () => {
    modalContext.setContent(
      <div className={styles.connectWalletContainer}>
        <div className={styles.connectWallet}>
          <Button
            color="primary"
            onClick={
              !userContext.isMetaMask
                ? () => window.open('https://metamask.io/download/')
                : userContext.connect
            }
          >
            Metamask
          </Button>
          <Button color="primary" onClick={() => handleWalletConnect()}>
            WalletConnect
          </Button>
        </div>
      </div>,
    );
    modalContext.setTitle('Connect Wallet');
  };

  const handleWalletConnect = useCallback(async function () {
    try {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: INFURA_ID,
          },
        },
      };

      let web3Modal;
      if (typeof window !== 'undefined') {
        web3Modal = new Web3Modal({
          network: 'mainnet',
          cacheProvider: true,
          disableInjectedProvider: true,
          providerOptions,
        });
      }
      // This is the initial `provider` that is returned when
      // using web3Modal to connect. Can be MetaMask or WalletConnect.
      modalContext.close();
      const provider = await web3Modal.connect();

      // We plug the initial `provider` into ethers.js and get back
      // a Web3Provider. This will add on methods from ethers.js and
      // event listeners such as `.on()` will be different.
      const web3Provider = new providers.Web3Provider(provider);

      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      // const network = await web3Provider.getNetwork();
      setMyAddress(address);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSwitchNetwork = () => {
    modalContext.close();

    userContext.switchNetwork();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <>
      <header
        className={classNames(
          styles.header,
          bgColor === 'transparent' ? styles.transparent : null,
        )}
      >
        <section className={styles.wrapper}>
          <h1 className={styles.logo}>
            <button className={styles.logoButton} onClick={handleLogoClick}>
              <img
                className={styles.logoImage}
                height="32"
                src="/images/starledger-logo-horizontal.svg"
              />
              <span className={styles.logoSeparator}>|</span>
              <span className={styles.logoApp} ref={logoButtonRef}>
                {appName}
              </span>
              <img
                className={classNames(
                  styles.arrow,
                  popoverContext.target ? styles.expanded : null,
                )}
                height="16"
                src="/images/icons/toggle-icon.svg"
              />
            </button>
          </h1>
          <div className={styles.user}>
            {userContext.chainId && (
              <div
                className={classNames(
                  styles.network,
                  userContext.chainId !== process.env.CHAIN_ID
                    ? styles.networkError
                    : null,
                )}
              >
                <span className={styles.networkName}>
                  {userContext.chainName}
                </span>
                {userContext.chainId !== process.env.CHAIN_ID && (
                  <button onClick={() => handleNetworkError()} />
                )}
              </div>
            )}
            {/* <Button
              className={styles.userButton}
              color="primary"
              disabled={!userContext.isMetaMask}
              display="icon"
              image="user"
              imageSize={32}
              onClick={
                userContext.isConnected
                  ? handleAvatarClick
                  : userContext.connect
              }
            >
              {!userContext.isMetaMask
                ? 'No MetaMask'
                : userContext.account
                ? userContext.account?.slice(0, 8)
                : 'Connect1'}
            </Button> */}
            <Button
              className={styles.userButton}
              color="primary"
              display="icon"
              image="user"
              imageSize={32}
              onClick={() =>
                userContext.account || myAddress
                  ? handleAvatarClick
                  : handleClickConnect()
              }
            >
              {userContext.account
                ? userContext.account?.slice(0, 8)
                : myAddress
                  ? myAddress?.slice(0, 8)
                  : 'Connect'}
            </Button>
          </div>
        </section>
      </header>
    </>
  );
};

export default Header;
