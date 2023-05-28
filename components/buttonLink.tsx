import classNames from 'classnames';
import { NextPage } from 'next';

import { useTooltip } from '../contexts/tooltip';

import styles from './button.module.css';

const ButtonLink: NextPage<{
  className?: string;
  color: 'primary' | 'secondary' | 'transparent';
  disabled?: boolean;
  display?: 'icon' | 'text';
  href?: string;
  image?: string;
  imageSize?: number;
  onClick?: (e: React.MouseEvent) => void;
  target?: string;
  textColor?: string;
  tooltip?: string;
  type?: 'button' | 'submit';
}> = ({
  className,
  color,
  children,
  display = 'text',
  disabled = false,
  href,
  image,
  imageSize,
  onClick = () => {},
  target,
  textColor,
  tooltip,
  type = 'button',
}) => {
  const tooltipContext = useTooltip();

  const handleClick = (e: React.MouseEvent) => {
    onClick(e);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (tooltip) {
      tooltipContext.setTarget(e.target as HTMLElement);
      tooltipContext.setTooltip(tooltip);
    }
  };

  const handleMouseLeave = () => {
    tooltipContext.setTarget(null);
    tooltipContext.setTooltip('');
  };

  return (
    <a
      className={classNames(
        styles.button,
        styles[color],
        display === 'icon' ? styles.icon : null,
        display === 'icon' && children ? styles.iconText : null,
        className,
      )}
      href={href}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      rel={target === '_blank' ? 'noopener noreferrer' : null}
      style={{
        backgroundImage: image ? `url(/images/icons/${image}-icon.svg)` : null,
        backgroundSize: imageSize ? `${imageSize}px ${imageSize}px` : null,
        color: textColor,
      }}
      target={target}
      type={type}
    >
      {children}
    </a>
  );
};

export default ButtonLink;
