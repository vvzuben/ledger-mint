import { NextPage } from 'next';
import Router from 'next/router';
import { useEffect } from 'react';
import ModalProvider from '../contexts/modal';
import NftProvider from '../contexts/nft';
import PopoverProvider from '../contexts/popover';
import TooltipProvider from '../contexts/tooltip';
import UserProvider, { useUser } from '../contexts/user';

import Header from './header';
import Loader from './loader';
import Modal from './modal';
import Popover from './popover';
import Tooltip from './tooltip';

import styles from './layout.module.css';
// import Footer from "./footer";

const LayoutContent: NextPage = ({ children }) => {
  return (
    <>
      <Header appName="Mint" bgColor="transparent" />
      <div className={styles.content}>{children}</div>
      {/* <Footer /> */}
      <Modal />
      <Popover />
      <Tooltip />
    </>
  );
};

const Layout: NextPage = ({ children }) => {
  return (
    <LayoutProvider>
      <LayoutContent>{children}</LayoutContent>
    </LayoutProvider>
  );
};

const LayoutProvider = ({ children }) => {
  return (
    <>
      <ModalProvider>
        <NftProvider>
          <PopoverProvider>
            <TooltipProvider>
              <UserProvider>{children}</UserProvider>
            </TooltipProvider>
          </PopoverProvider>
        </NftProvider>
      </ModalProvider>
    </>
  );
};

export default Layout;
