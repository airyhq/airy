import React, {useEffect, useRef} from 'react';

type ListenOutsideClickProps = {
  children: React.ReactNode;
  className?: string;
  onOuterClick: () => void;
};

export const ListenOutsideClick = ({children, className, onOuterClick}: ListenOutsideClickProps) => {
  const innerRef = useRef(null);

  useEffect(() => {
    const handleClick = event => {
      if (innerRef.current && !innerRef.current.contains(event.target)) {
        event.preventDefault();
        onOuterClick();
      }
    };

    const keyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOuterClick();
      }
    };

    // only add listener, if the element exists
    if (innerRef.current) {
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', keyDown);
    }

    // unmount previous first in case inputs have changed
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', keyDown);
    };
  }, [onOuterClick, innerRef]);

  return (
    <div className={className} ref={innerRef}>
      {children}
    </div>
  );
};
