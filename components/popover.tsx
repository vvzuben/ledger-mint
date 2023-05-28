import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { PopoverContext } from '../contexts/popover';

import styles from './popover.module.css';

const PopoverContent = () => {
  const popoverContext = useContext(PopoverContext);

  const popoverRef = useRef<HTMLDivElement>(null);

  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      hide(e);
    }
  };

  const hide = (event: Event) => {
    if (
      popoverRef.current?.contains(event.target as HTMLElement) ||
      popoverContext.target?.contains(event.target as HTMLElement)
    ) {
      return;
    }

    popoverContext.setTarget(null);
  };

  const resize = () => {
    if (!popoverRef.current || !popoverContext.target) {
      return;
    }

    const popoverRect = popoverRef.current.getBoundingClientRect();
    const targetRect = popoverContext.target.getBoundingClientRect();

    let targetCenter =
      targetRect.left + targetRect.width / 2 - popoverRect.width / 2;
    if (targetCenter + popoverRect.width > window.innerWidth) {
      targetCenter = window.innerWidth - 20 - popoverRect.width;
    } else if (targetCenter < 0) {
      targetCenter = 60;
    }

    setLeft(targetCenter);
    setTop(targetRect.top + targetRect.height + 10);
  };

  useLayoutEffect(() => {
    resize();

    window.addEventListener('resize', resize);
    document.body.addEventListener('mousedown', hide);

    return () => {
      window.removeEventListener('resize', resize);
      document.body.removeEventListener('mousedown', hide);
    };
  }, [popoverContext.target]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div
      className={styles.popover}
      ref={popoverRef}
      style={{
        left,
        top,
      }}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>{popoverContext.title}</h3>
        <div>{popoverContext.content}</div>
      </div>
    </div>
  );
};

const Popover = () => {
  const popoverContext = useContext(PopoverContext);

  if (popoverContext.target) {
    return <PopoverContent />;
  }

  return null;
};

export default Popover;
