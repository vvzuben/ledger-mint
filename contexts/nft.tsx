import { ethers } from 'ethers';
import * as React from 'react';

import NftContract from '../contracts/StarLedgerNFTContract.json';

interface INftItem {
  tokenId: number;
}

export type NftContextType = {
  items: INftItem[];
  load: () => Promise<void>;
};

export const NftContext = React.createContext<NftContextType | null>(null);

const NftProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [items, setItems] = React.useState<INftItem[]>([]);

  const load = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum,
    );

    const nftContract = new ethers.Contract(
      process.env.STARLEDGER_NFT_CONTRACT_ADDRESS,
      NftContract,
      provider.getSigner(0),
    );

    const promises: Promise<{}>[] = [];
    const newItems: INftItem[] = [];
    try {
      for (let i = 0; i < 5000; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(
          (window as any).ethereum.selectedAddress,
          i,
        );

        const promise = new Promise(async (res) => {
          newItems.push({ tokenId: tokenId.toNumber() });

          res({});
        });

        promises.push(promise);
      }
    } catch {
    } finally {
      console.log(newItems);
    }

    await Promise.all(promises);

    setItems(newItems);
  };

  return (
    <NftContext.Provider
      value={{
        items,
        load,
      }}
    >
      {children}
    </NftContext.Provider>
  );
};

export function useNft() {
  return React.useContext(NftContext);
}

export default NftProvider;
