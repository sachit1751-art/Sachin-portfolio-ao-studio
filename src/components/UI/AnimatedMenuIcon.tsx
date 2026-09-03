import React from 'react';
import { motion, Variants } from 'motion/react';

interface AnimatedMenuIconProps {
  isOpen: boolean;
  variant?: 'x' | 'arrow' | 'close' | 'plus' | 'check' | 'arrowUpRight' | 'chevron';
  color?: string;
  size?: number;
}

export const AnimatedMenuIcon: React.FC<AnimatedMenuIconProps> = ({
  isOpen,
  variant = 'x',
  color = 'currentColor',
  size = 24,
}) => {
  const unitWidth = 24;
  const unitHeight = 24;

  const variants: Record<string, { top: Variants; center: Variants; bottom: Variants }> = {
    x: {
      top: {
        closed: { d: 'M 3 6 L 21 6' },
        open: { d: 'M 5 5 L 19 19' },
      },
      center: {
        closed: { opacity: 1, d: 'M 3 12 L 21 12' },
        open: { opacity: 0, d: 'M 12 12 L 12 12' },
      },
      bottom: {
        closed: { d: 'M 3 18 L 21 18' },
        open: { d: 'M 5 19 L 19 5' },
      },
    },
    arrow: {
      top: {
        closed: { d: 'M 3 6 L 21 6' },
        open: { d: 'M 12 6 L 4 12' },
      },
      center: {
        closed: { opacity: 1, d: 'M 3 12 L 21 12' },
        open: { opacity: 1, d: 'M 4 12 L 20 12' },
      },
      bottom: {
        closed: { d: 'M 3 18 L 21 18' },
        open: { d: 'M 12 18 L 4 12' },
      },
    },
    plus: {
      top: {
        closed: { d: 'M 3 6 L 21 6' },
        open: { d: 'M 12 4 L 12 20' },
      },
      center: {
        closed: { opacity: 1, d: 'M 3 12 L 21 12' },
        open: { opacity: 1, d: 'M 4 12 L 20 12' },
      },
      bottom: {
        closed: { d: 'M 3 18 L 21 18' },
        open: { d: 'M 12 4 L 12 20' },
      },
    },
    check: {
      top: {
        closed: { d: 'M 3 6 L 21 6' },
        open: { d: 'M 5 12 L 10 17' },
      },
      center: {
        closed: { opacity: 1, d: 'M 3 12 L 21 12' },
        open: { opacity: 1, d: 'M 10 17 L 20 7' },
      },
      bottom: {
        closed: { d: 'M 3 18 L 21 18' },
        open: { d: 'M 10 17 L 20 7' },
      },
    },
    arrowUpRight: {
      top: {
        closed: { d: 'M 3 6 L 21 6' },
        open: { d: 'M 10 5 L 19 5 L 19 14' },
      },
      center: {
        closed: { opacity: 1, d: 'M 3 12 L 21 12' },
        open: { opacity: 1, d: 'M 5 19 L 19 5' },
      },
      bottom: {
        closed: { d: 'M 3 18 L 21 18' },
        open: { d: 'M 10 5 L 19 5 L 19 14' },
      },
    },
    chevron: {
      top: {
        closed: { d: 'M 6 9 L 12 15' },
        open: { d: 'M 6 15 L 12 9' },
      },
      center: {
        closed: { opacity: 0, d: 'M 12 12 L 12 12' },
        open: { opacity: 0, d: 'M 12 12 L 12 12' },
      },
      bottom: {
        closed: { d: 'M 12 15 L 18 9' },
        open: { d: 'M 12 9 L 18 15' },
      },
    },
  };

  const currentVariant = variants[variant] || variants.x;

  return (
    <motion.svg
      viewBox={`0 0 ${unitWidth} ${unitHeight}`}
      width={size}
      height={size}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
    >
      <motion.path
        variants={currentVariant.top}
        fill="transparent"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.path
        variants={currentVariant.center}
        fill="transparent"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.path
        variants={currentVariant.bottom}
        fill="transparent"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
    </motion.svg>
  );
};
