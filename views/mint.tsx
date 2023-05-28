import axios from 'axios';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';

import Button from '../components/button';
import Loader from '../components/loader';
import Countdown from '../components/countdown';
import Social from '../components/social';

import { useModal } from '../contexts/modal';
import { useUser } from '../contexts/user';

import ethereumNftContract from '../contracts/StarLedgerNFTEthereumContract.json';

import styles from './mint.module.scss';
import ButtonLink from '../components/buttonLink';

export const Mint = () => {
  const modalContext = useModal();
  const userContext = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMint, setIsLoadingMint] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPresale, setIsPresale] = useState(false);

  const [error, setError] = useState('');
  const [mintAvailable, setMintAvailable] = useState(5000);
  const [mintCount, setMintCount] = useState(0);
  const [mintCost, setMintCost] = useState(0.09);
  const [presaleTokensLimit, setPresaleTokensLimit] = useState(0);

  const [hasMinted, setHasMinted] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const [transactionHash, setTransactionHash] = useState('');

  const handleMint = async () => {
    try {
      setError('');
      setIsLoadingMint(true);

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
      );

      const mintContract = new ethers.Contract(
        process.env.STARLEDGER_MINT_CONTRACT_ADDRESS,
        ethereumNftContract,
        provider.getSigner(0),
      );

      if (isPaused && isPresale) {
        const tx = await mintContract.mint(quantity, {
          value: ethers.utils.parseEther(`${quantity * mintCost}`),
        });

        const receipt = await tx.wait();
        if (receipt === null) {
          throw new Error(
            'Failed to confirm transaction. Check Etherscan before making another attempt.',
          );
        }
        setTransactionHash(receipt.transactionHash);
      } else {
        const tx = await mintContract.mint(quantity, {
          value: ethers.utils.parseEther(`${quantity * mintCost}`),
        });

        const receipt = await tx.wait();
        if (receipt === null) {
          throw new Error(
            'Failed to confirm transaction. Check Etherscan before making another attempt.',
          );
        }
        setTransactionHash(receipt.transactionHash);
      }

      setHasMinted(true);
    } catch (error) {
      console.log(error);

      if (
        error.message?.includes('insufficient funds') ||
        error.data?.message?.includes('insufficient funds')
      ) {
        setError('Insufficient funds.');
      } else if (
        error.message?.includes('Presale minting disabled') ||
        error.data?.message?.includes('Presale minting disabled')
      ) {
        setError('Presale minting not available.');
      } else if (
        error.message?.includes('Not enough ETH') ||
        error.data?.message?.includes('Not enough ETH')
      ) {
        setError('Not enough ETH');
      } else if (
        error.message?.includes('Incorrect proof') ||
        error.data?.message?.includes('Incorrect proof')
      ) {
        setError('Not on presale list');
      } else if (
        error.message?.includes('Presale tokens limit reached') ||
        error.data?.message?.includes('Presale tokens limit reached')
      ) {
        setError('Presale tokens limit reached');
      } else if (
        error.message?.includes("You can't mint 0 tokens") ||
        error.data?.message?.includes("You can't mint 0 tokens")
      ) {
        setError('All NFTs are minted.');
      } else if (
        error.message?.includes('Not enough tokens to mint') ||
        error.data?.message?.includes('Not enough tokens to mint')
      ) {
        setError('Not enough NFTs.');
      } else if (
        error.message?.includes('Pausable: paused') ||
        error.data?.message?.includes('Pausable: paused')
      ) {
        setError('Public minting not available.');
      } else if (
        error.message?.includes('Insufficient balance for transfer') ||
        error.data?.message?.includes('Insufficient balance for transfer')
      ) {
        setError('Insufficient balance for transfer.');
      } else if (
        error.message?.includes('gas required exceeds allowance') ||
        error.data?.message?.includes('gas required exceeds allowance')
      ) {
        setError('Insufficient gas.');
      } else if (error.message?.includes('User denied transaction signature')) {
        setError('User denied transaction.');
      } else if (
        error.message?.includes(
          'Failed to confirm transaction. Check Etherscan before making another attempt.',
        )
      ) {
        setError(
          'Failed to confirm transaction. Check Etherscan before making another attempt.',
        );
      } else if (
        error.message?.includes(
          'Please enable Blind signing or Contract data in the Ethereum app Settings',
        )
      ) {
        setError(
          'Please enable Blind signing or Contract data in the Ethereum app Settings.',
        );
      } else {
        setError(
          'Failed to mint. Check Etherscan before making another attempt.',
        );

        axios({
          method: 'POST',
          url: `${process.env.STARLEDGER_API_URL}/createErrorLog`,
          data: {
            code: `${error.code}`,
            message: error.message,
            notes: JSON.stringify(error.data || {}),
          },
        });
      }
    }

    setIsLoadingMint(false);
  };

  const handleQuantity = (value: string) => {
    const newQuantity = Number(value.replace(/\D/g, ''));
    setQuantity(newQuantity);
  };

  const handleQuantityAddition = () => {
    let newQuantity = quantity + 1;
    let maxQuantity = presaleTokensLimit - userContext.nftCount;
    if (maxQuantity === 0) {
      maxQuantity = 1;
    }
    if (newQuantity > maxQuantity) {
      newQuantity = maxQuantity;
    }
    setQuantity(newQuantity);
  };

  const handleQuantitySubtraction = () => {
    let newQuantity = quantity - 1;
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    setQuantity(newQuantity);
  };

  const handleSwitchNetwork = () => {
    if (!userContext.isMetaMask) {
      modalContext.setTitle('MetaMask Required');
      modalContext.setContent(
        <p>
          Please use the MetaMask app (on{' '}
          <a
            href="https://apps.apple.com/us/app/metamask/id1438144202"
            rel="noopener noreferrer"
            target="_blank"
          >
            iOS
          </a>{' '}
          or{' '}
          <a
            href="https://play.google.com/store/apps/details?id=io.metamask"
            rel="noopener noreferrer"
            target="_blank"
          >
            Android
          </a>
          ) or the MetaMask plug-in (on{' '}
          <a
            href="https://metamask.io/download/"
            rel="noopener noreferrer"
            target="_blank"
          >
            desktop
          </a>
          ) to continue.
        </p>,
      );
    }
    userContext.switchNetwork();
  };

  const load = async () => {
    setTimeout(() => setIsLoading(false), 1000);

    if (userContext.chainId !== process.env.CHAIN_ID) {
      return;
    }

    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum,
    );

    const mintContract = new ethers.Contract(
      process.env.STARLEDGER_MINT_CONTRACT_ADDRESS,
      ethereumNftContract,
      provider.getSigner('0x0f0031bC7C63280AC8c9e3B7260E2ed92dEb9586'),
    );

    const newMintCount = await mintContract.totalSupply();
    setMintCount(newMintCount.toNumber());

    const newMintCost = await mintContract.cost();
    setMintCost(Number(ethers.utils.formatUnits(newMintCost, 18)));

    const newIsPaused = await mintContract.paused();
    setIsPaused(newIsPaused);

    const newIsPresale = await mintContract.presaleMintEnabled();
    setIsPresale(newIsPresale);

    const newPresaleTokensLimit = await mintContract.presaleTokensLimit();
    setPresaleTokensLimit(newPresaleTokensLimit.toNumber());

    const handleBaseURIUpdate = (uri: string) => {
      console.log('BaseURIUpdate');
      console.log(uri);
    };

    const handleCostUpdate = (cost: BigNumber) => {
      console.log('CostUpdate');
      setMintCost(Number(ethers.utils.formatUnits(cost, 18)));
    };

    const handlePaused = () => {
      console.log('Paused');
      setIsPaused(true);
    };

    const handlePresaleMintEnabledUpdate = (enabled: boolean) => {
      console.log('PresaleMintEnabledUpdate');
      setIsPresale(enabled);
    };

    const handlePresaleTokensLimitUpdate = (limit: BigNumber) => {
      console.log('PresaleTokensLimitUpdate');
      setPresaleTokensLimit(limit.toNumber());
    };

    const handleTransfer = async () => {
      console.log('Transfer');
      const newMintCount = await mintContract.totalSupply();
      setMintCount(newMintCount.toNumber());
    };

    const handleUnpaused = () => {
      console.log('Unpaused');
      setIsPaused(false);
    };

    mintContract.on('BaseURIUpdate', handleBaseURIUpdate);
    mintContract.on('CostUpdate', handleCostUpdate);
    mintContract.on('Paused', handlePaused);
    mintContract.on('PresaleMintEnabledUpdate', handlePresaleMintEnabledUpdate);
    mintContract.on('PresaleTokensLimitUpdate', handlePresaleTokensLimitUpdate);
    mintContract.on('Transfer', handleTransfer);
    mintContract.on('Unpaused', handleUnpaused);

    // INIT:
    // console.log("pause");
    // console.log(await mintContract.pause());
    // console.log("setCost");
    // await mintContract.setCost(
    //   ethers.utils.formatUnits("90000000000000000", 0)
    // );
    // console.log("setPresaleMintEnabled");
    // console.log(await mintContract.setPresaleMintEnabled(true));
    // console.log("setPresaleTokensLimit");
    // console.log(await mintContract.setPresaleTokensLimit(2500));
    // console.log("setPresaleMerkleTreeRoot");
    // console.log(await mintContract.setPresaleMerkleTreeRoot(`0x${merkleRoot}`));
    // console.log("setBaseURI");
    // console.log(await mintContract.setBaseURI("https://cdn.starledger.org/metadata/"));
    // console.log("done");

    // LATER:
    // console.log(await mintContract.adminMint(1));
    // console.log(await mintContract.tokenURI(2501));
    // console.log(await mintContract.adminMintTokenIds([1000]));
    // await mintContract.withdraw();

    return () => {
      mintContract.off('BaseURIUpdate', handleBaseURIUpdate);
      mintContract.off('CostUpdate', handleCostUpdate);
      mintContract.off('Paused', handlePaused);
      mintContract.off(
        'PresaleMintEnabledUpdate',
        handlePresaleMintEnabledUpdate,
      );
      mintContract.off(
        'PresaleTokensLimitUpdate',
        handlePresaleTokensLimitUpdate,
      );
      mintContract.off('Transfer', handleTransfer);
      mintContract.off('Unpaused', handleUnpaused);
    };
  };

  useEffect(() => {
    load();
  }, [userContext.chainId]);

  if (isLoading) {
    return <Loader color="black" />;
  }

  if (hasMinted) {
    return (
      <div className={styles.container}>
        <div className={styles.success}>
          <h2>
            Minted{' '}
            <b>
              {quantity} star{quantity === 1 ? '' : 's'}
            </b>
          </h2>
          <p>Congratulations, Stargazer!</p>
          <p>You now hold a piece of our Galaxy.</p>
          <p>Stars will be revealed in 48 hours!</p>
          <p>We’re glad you’re here.</p>
          <div>
            <ButtonLink
              color="transparent"
              href={`https://etherscan.io/tx/${transactionHash}`}
              target="_blank"
              textColor="white"
            >
              View on Etherscan
            </ButtonLink>
            <Button color="primary" onClick={() => window.location.reload()}>
              Mint Again
            </Button>
          </div>
        </div>
        <Social />
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.message}>
            <div className={styles.messageContent}>
              <h3>Now Available on Ethereum</h3>
              <h4>StarLedger NFT</h4>
              <h5>Limited NFT collection of 5000 real-life stars</h5>
              <p>A lifetime membership for StarLedger NFT holders.</p>
              <ul>
                <li>
                  Join a community of astronauts, astrophysicists,
                  astrophotographers and space hobbyists
                </li>
                <li>
                  3D renderings based on extensive and accurate data mapped to
                  real stars in our galaxy
                </li>
                <li>
                  View stars on an interactive{' '}
                  <a
                    href="https://map.starledger.org"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    3D map
                  </a>
                </li>
                <li>Stargazing in VR (coming soon)</li>
                <li>Animations &amp; Lore for top 100 Legendary stars</li>
                <li>
                  Access to future mints, exclusive mints &amp; StarLedger
                  Metaverse (coming soon)
                </li>
              </ul>
              {userContext.chainId !== process.env.CHAIN_ID && (
                <div className={styles.buy}>
                  <Button color="primary" onClick={() => handleSwitchNetwork()}>
                    Switch Network
                  </Button>
                </div>
              )}
              {userContext.chainId === process.env.CHAIN_ID && (
                <div className={styles.buy}>
                  <span className={styles.quantityContainer}>
                    <input
                      className={styles.quantity}
                      disabled={isLoadingMint}
                      onChange={(event) => handleQuantity(event.target.value)}
                      value={quantity}
                    />
                    <button
                      className={styles.quantitySubtract}
                      disabled={isLoadingMint}
                      onClick={() => handleQuantitySubtraction()}
                    >
                      -
                    </button>
                    <button
                      className={styles.quantityAdd}
                      disabled={isLoadingMint}
                      onClick={() => handleQuantityAddition()}
                    >
                      +
                    </button>
                  </span>
                  <span className={styles.multiply}>x</span>
                  <Button
                    color="primary"
                    disabled={
                      isLoadingMint ||
                      (isPaused && !isPresale) ||
                      mintCost === 0 ||
                      mintAvailable - mintCount <= 0 ||
                      userContext.nftCount >= presaleTokensLimit ||
                      userContext.nftCount + quantity > presaleTokensLimit
                    }
                    onClick={() => handleMint()}
                  >
                    {isLoadingMint ? (
                      'Waiting'
                    ) : (
                      <>
                        <b>{mintCost} ETH</b>
                      </>
                    )}
                  </Button>
                </div>
              )}
              {!userContext.isConnected && <h6>2338 remaining</h6>}
              {userContext.isConnected && (
                <h6>
                  {userContext.chainId === process.env.CHAIN_ID ? (
                    <>{5000 - mintCount} remaining</>
                  ) : (
                    <>Switch Network</>
                  )}
                </h6>
              )}
            </div>
            <div>
              <video
                className={styles.video}
                loop
                playsInline
                muted
                autoPlay
                src="https://cdn.starledger.org/videos/11767-720.mp4"
              />
            </div>
          </div>
          <Social />
          {error && (
            <div className={styles.error}>
              {error}{' '}
              <Button color="secondary" onClick={() => setError('')}>
                Close
              </Button>
            </div>
          )}
          {isLoadingMint && <Loader color="white" />}
        </div>
      </div>
    </>
  );
};
