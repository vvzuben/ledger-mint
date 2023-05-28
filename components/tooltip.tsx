import { NextPage } from 'next';
import { useContext, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { TooltipContext } from '../contexts/tooltip';

import styles from './tooltip.module.css';

const TooltipContent = () => {
  const { target, tooltip } = useContext(TooltipContext);

  const tooltipRef = useRef<HTMLDivElement>(null);

  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  const resize = () => {
    if (!tooltipRef.current || !target) {
      return;
    }

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const targetCenter =
      targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;

    setLeft(targetCenter);
    setTop(targetRect.top + targetRect.height + 5);
  };

  useLayoutEffect(() => {
    resize();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [target]);

  return (
    <div
      className={styles.tooltip}
      ref={tooltipRef}
      style={{
        left,
        top,
      }}
    >
      {tooltip}
    </div>
  );
};

const Tooltip = () => {
  const tooltipContext = useContext(TooltipContext);

  if (tooltipContext.target) {
    return <TooltipContent />;
  }

  return null;
};

export default Tooltip;
