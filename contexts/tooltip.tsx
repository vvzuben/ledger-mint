import * as React from 'react';

export type TooltipContextType = {
  target: HTMLElement;
  setTarget: (target: HTMLElement) => void;
  tooltip: string;
  setTooltip: (tooltip: string) => void;
};

export const TooltipContext = React.createContext<TooltipContextType | null>(
  null,
);

const TooltipProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [target, setTarget] = React.useState<HTMLElement>();
  const [tooltip, setTooltip] = React.useState('');

  return (
    <TooltipContext.Provider value={{ target, setTarget, tooltip, setTooltip }}>
      {children}
    </TooltipContext.Provider>
  );
};

export function useTooltip() {
  return React.useContext(TooltipContext);
}

export default TooltipProvider;
