'use client';
import { cn } from '@/lib/utils';
import { AnimatePresence, type Transition, motion } from 'framer-motion';
import {
  Children,
  cloneElement,
  type ReactElement,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useState,
  useId,
} from 'react';

type AnimatedBackgroundProps = {
  children:
    | ReactElement<{ 'data-id': string }>[]
    | ReactElement<{ 'data-id': string }>;
  defaultValue?: string;
  onValueChange?: (newActiveId: string | null) => void;
  className?: string;
  transition?: Transition;
  enableHover?: boolean;
};

// Define props to avoid type errors
type ChildProps = {
  'data-id': string;
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  onMouseEnter?: (event: ReactMouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: ReactMouseEvent<HTMLElement>) => void;
  className?: string;
  children?: ReactNode;
  'aria-selected'?: boolean;
  'data-checked'?: string;
};

export default function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  transition,
  enableHover = false,
}: AnimatedBackgroundProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const uniqueId = useId();

  const handleSetActiveId = (id: string | null) => {
    setActiveId(id);

    if (onValueChange) {
      onValueChange(id);
    }
  };

  useEffect(() => {
    if (defaultValue !== undefined) {
      setActiveId(defaultValue);
    }
  }, [defaultValue]);

  return Children.map(children, (child: ReactElement<ChildProps>, index) => {
    const id = child.props['data-id'];

    const composedOnClick = (event: ReactMouseEvent<HTMLElement>) => {
      if (typeof child.props.onClick === 'function') {
        child.props.onClick(event);
      }
      if (!enableHover) {
        handleSetActiveId(id);
      }
    };

    const composedOnMouseEnter = (event: ReactMouseEvent<HTMLElement>) => {
      if (typeof child.props.onMouseEnter === 'function') {
        child.props.onMouseEnter(event);
      }
      if (enableHover) {
        handleSetActiveId(id);
      }
    };

    const composedOnMouseLeave = (event: ReactMouseEvent<HTMLElement>) => {
      if (typeof child.props.onMouseLeave === 'function') {
        child.props.onMouseLeave(event);
      }
      if (enableHover) {
        handleSetActiveId(null);
      }
    };

    return cloneElement(
      child,
      {
        key: index,
        className: cn('relative inline-flex', child.props.className),
        'aria-selected': activeId === id,
        'data-checked': activeId === id ? 'true' : 'false',
        ...(enableHover
          ? { onMouseEnter: composedOnMouseEnter, onMouseLeave: composedOnMouseLeave }
          : { onClick: composedOnClick }),
      },
      <>
        <AnimatePresence initial={false}>
          {activeId === id && (
            <motion.div
              layoutId={`background-${uniqueId}`}
              className={cn('absolute inset-0 pointer-events-none', className)}
              transition={transition}
              initial={{ opacity: defaultValue ? 1 : 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>
        <span className="z-10">{child.props.children}</span>
      </>
    );
  });
}


