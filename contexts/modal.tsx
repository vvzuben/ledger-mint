import * as React from 'react';

export type ModalContextType = {
  canClose: boolean;
  setCanClose: (canClose: boolean) => void;
  close: () => void;
  content: React.ReactElement;
  setContent: (content: React.ReactElement) => void;
  title: string;
  setTitle: (title: string) => void;
};

export const ModalContext = React.createContext<ModalContextType | null>(null);

const ModalProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [canClose, setCanClose] = React.useState(true);
  const [content, setContent] = React.useState<React.ReactElement>();
  const [title, setTitle] = React.useState('');

  const close = () => {
    setContent(null);
    setTitle(null);
  };

  return (
    <ModalContext.Provider
      value={{
        canClose,
        setCanClose,
        close,
        content,
        setContent,
        title,
        setTitle,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export function useModal() {
  return React.useContext(ModalContext);
}

export default ModalProvider;
