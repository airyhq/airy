import React, {useEffect, useRef} from 'react';

type ListenOutsideClickProps = {
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
};

const ListenOutsideClick: React.FC<ListenOutsideClickProps> = ({
  children,
  className,
  onClose,
}: ListenOutsideClickProps): JSX.Element => {
  const innerRef = useRef(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (innerRef.current && !innerRef.current.contains(event.target)) {
        event.preventDefault();
        onClose();
      }
    };

    const keyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // only add listener, if the element exists
    if (innerRef.current) {
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', keyDown);
    }

    // unmount previous first in case inputs have changed
    return () => {
      document.removeEventListener('keydown', keyDown);
      document.removeEventListener('click', handleClick);
    };
  }, [onClose, innerRef]);

  return (
    <div className={className} ref={innerRef}>
      {children}
    </div>
  );
};

export default ListenOutsideClick;
