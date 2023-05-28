import * as React from 'react';

export type PopoverContextType = {
  content: React.ReactElement;
  setContent: (content: React.ReactElement) => void;
  target: HTMLElement;
  setTarget: (target: HTMLElement) => void;
  title: string;
  setTitle: (title: string) => void;
};

export const PopoverContext = React.createContext<PopoverContextType | null>(
  null,
);

const PopoverProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [content, setContent] = React.useState<React.ReactElement>();
  const [target, setTarget] = React.useState<HTMLElement>();
  const [title, setTitle] = React.useState('');

  return (
    <PopoverContext.Provider
      value={{
        content,
        setContent,
        target,
        setTarget,
        title,
        setTitle,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
};

export function usePopover() {
  return React.useContext(PopoverContext);
}

export default PopoverProvider;
