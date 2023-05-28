import classNames from 'classnames';
import { NextPage } from 'next';

import { useTooltip } from '../contexts/tooltip';

import styles from './button.module.css';

const Button: NextPage<{
  className?: string;
  color: 'primary' | 'secondary' | 'transparent';
  disabled?: boolean;
  display?: 'icon' | 'text';
  image?: string;
  imageSize?: number;
  onClick?: (e: React.MouseEvent) => void;
  textColor?: string;
  tooltip?: string;
  type?: 'button' | 'submit';
}> = ({
  className,
  color,
  children,
  display = 'text',
  disabled = false,
  image,
  imageSize,
  onClick = () => {},
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
    <button
      className={classNames(
        styles.button,
        styles[color],
        display === 'icon' ? styles.icon : null,
        display === 'icon' && children ? styles.iconText : null,
        className,
      )}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundImage: image ? `url(/images/icons/${image}-icon.svg)` : null,
        backgroundSize: imageSize ? `${imageSize}px ${imageSize}px` : null,
        color: textColor,
      }}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
