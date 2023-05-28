import axios from 'axios';
import { ethers } from 'ethers';
import * as React from 'react';
import Web3 from 'web3';

import ethereumNftContract from '../contracts/StarLedgerNFTEthereumContract.json';

import getChainName from '../utils/getChainName';

export type UserContextType = {
  connect: () => Promise<void>;
  account: string;
  setAccount: (account: string) => void;
  chainId: string;
  chainName: string;
  setChainId: (chainId: string) => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
  isAuthenticated: boolean;
  isConnecting: boolean;
  isHolder: boolean;
  isLoading: boolean;
  isMetaMask: boolean;
  isSwitchingNetwork: boolean;
  login: () => Promise<void>;
  logout: () => void;
  nftCount: number;
  setNftCount: (nftCount: number) => void;
  signature: string;
  wallet: 'metamask' | 'polis';
  setWallet: (wallet: 'metamask' | 'polis') => void;
  switchNetwork: () => void;
};

export const UserContext = React.createContext<UserContextType | null>(null);

const UserProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [account, setAccount] = React.useState('');
  const [chainId, setChainId] = React.useState('');
  const [chainName, setChainName] = React.useState('');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isHolder, setIsHolder] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMetaMask, setIsMetaMask] = React.useState(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = React.useState(false);
  const [nftCount, setNftCount] = React.useState(0);
  const [signature, setSignature] = React.useState('signature');
  const [wallet, setWallet] = React.useState<'metamask' | 'polis'>();

  function addressEqual(a: string, b: string) {
    return a.toLowerCase() === b.toLowerCase();
  }

  const connect = async () => {
    setIsAuthenticated(false);
    setIsConnecting(true);

    const accounts = await (window as any).ethereum.request({
      method: 'eth_requestAccounts',
    });

    setAccount(accounts[0]);
    setChainId((window as any).ethereum.chainId);
    setWallet('metamask');

    // if (!signature) {
    //   const web3 = new Web3((window as any).ethereum);
    //   const message = web3.utils.utf8ToHex(
    //     "Welcome to StarLedger Account. Please sign this message to confirm your identity."
    //   );
    //   const newSignature = await web3.eth.personal.sign(
    //     message,
    //     accounts[0],
    //     "password!"
    //   );
    //   localStorage.setItem("signature", newSignature);
    //   setSignature(newSignature);
    // }

    await load();

    // if ((window as any).ethereum.chainId !== "0x440") {
    //   modalContext.setContent(
    //     <div className={styles.invalidNetworkModal}>
    //       <p>
    //         Use MetaMask to switch to the Metis Andromeda network or click the
    //         button below to disconnect.
    //       </p>
    //       <ul>
    //         <li>
    //           <b>
    //             Required: Metis Andromeda Mainnet{" "}
    //             <a
    //               href="https://chainlist.org/?search=metis"
    //               rel="noopener noreferrer"
    //               target="_blank"
    //             >
    //               <LinkIcon />
    //             </a>
    //           </b>
    //         </li>
    //         <li>
    //           <span>Current: {userContext.chainName}</span>
    //         </li>
    //       </ul>
    //       <div>
    //         <Button
    //           color="secondary"
    //           onClick={() => {
    //             sessionStorage.clear();
    //             window.location.reload();
    //           }}
    //         >
    //           Disconnect
    //         </Button>
    //         <Button color="primary" onClick={() => handleNetwork()}>
    //           Switch
    //         </Button>
    //       </div>
    //     </div>
    //   );
    // } else {
    //   modalContext.close();
    // }
  };

  const load = async () => {
    if (typeof (window as any).ethereum === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
      );

      const nftContract = new ethers.Contract(
        process.env.STARLEDGER_NFT_CONTRACT_ADDRESS,
        ethereumNftContract,
        provider.getSigner(0),
      );

      const sentLogs = await nftContract.queryFilter(
        nftContract.filters.Transfer(
          (window as any).ethereum.selectedAddress,
          null,
        ),
      );
      const receivedLogs = await nftContract.queryFilter(
        nftContract.filters.Transfer(
          null,
          (window as any).ethereum.selectedAddress,
        ),
      );

      const logs = sentLogs
        .concat(receivedLogs)
        .sort(
          (a, b) =>
            a.blockNumber - b.blockNumber ||
            a.transactionIndex - b.transactionIndex,
        );

      const owned = new Set();

      for (const {
        args: { from, to, tokenId },
      } of logs) {
        if (addressEqual(to, (window as any).ethereum.selectedAddress)) {
          owned.add(tokenId.toString());
        } else if (
          addressEqual(from, (window as any).ethereum.selectedAddress)
        ) {
          owned.delete(tokenId.toString());
        }
      }

      setAccount((window as any).ethereum.selectedAddress);
      setIsAuthenticated(true);
      setIsHolder(owned.size > 0);
      setNftCount(owned.size);
      setWallet('metamask');
      setSignature(localStorage.getItem('signature'));
    } catch (error) {
      console.log(error);
      setAccount('');
      setIsAuthenticated(false);
      setWallet(null);
      setSignature('');
    }

    setIsLoading(false);
  };

  const logout = () => {
    localStorage.clear();

    setAccount('');
    setIsAuthenticated(false);
    setWallet(null);
    setSignature('');
  };

  const login = async () => {
    const web3 = new Web3((window as any).ethereum);
    const message = web3.utils.utf8ToHex(
      'Welcome to StarLedger Account. Please sign this message to confirm your identity.',
    );
    const newSignature = await web3.eth.personal.sign(
      message,
      (window as any).ethereum.selectedAddress,
      'password!',
    );
    localStorage.setItem('signature', newSignature);
    setSignature(newSignature);

    await load();
  };

  const switchNetwork = async () => {
    setIsSwitchingNetwork(true);

    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: process.env.CHAIN_ID }],
      });
    } catch (error) {
      console.log(error);
    }

    setIsSwitchingNetwork(false);
  };

  React.useEffect(() => {
    if (account && chainId) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [account, chainId]);

  React.useEffect(() => {
    setChainName(getChainName(chainId));
  }, [chainId]);

  React.useEffect(() => {
    setTimeout(() => {
      if (typeof (window as any).ethereum !== 'undefined') {
        (window as any).ethereum.on('accountsChanged', async () => {
          window.location.reload();
        });

        (window as any).ethereum.on('networkChanged', async () => {
          setChainId((window as any).ethereum.chainId);
        });

        setChainId((window as any).ethereum.chainId);
        setIsMetaMask((window as any).ethereum.isMetaMask);
      } else {
        setIsMetaMask(false);
      }

      load();
    }, 1000);
  }, []);

  return (
    <UserContext.Provider
      value={{
        connect,
        account,
        setAccount,
        chainId,
        setChainId,
        chainName,
        isConnected,
        setIsConnected,
        isAuthenticated,
        isConnecting,
        isHolder,
        isLoading,
        isMetaMask,
        isSwitchingNetwork,
        login,
        logout,
        nftCount,
        setNftCount,
        signature,
        wallet,
        setWallet,
        switchNetwork,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  return React.useContext(UserContext);
}

export default UserProvider;
