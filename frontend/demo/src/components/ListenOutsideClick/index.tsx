import React, {useEffect, useRef} from 'react';

type ListenOutsideClickProps = {
  children: React.ReactNode;
  className?: string;
  onOuterClick: (event: React.MouseEvent<HTMLElement>) => void;
};

const ListenOutsideClick: React.FC<ListenOutsideClickProps> = ({
  children,
  className,
  onOuterClick,
}: ListenOutsideClickProps): JSX.Element => {
  const innerRef = useRef(null);

  useEffect(() => {
    const handleClick = (event: React.MouseEvent<HTMLElement> | any) => {
      innerRef.current && !innerRef.current.contains(event.target) && onOuterClick(event);
    };

    // only add listener, if the element exists
    if (innerRef.current) {
      document.addEventListener('click', handleClick);
    }

    // unmount previous first in case inputs have changed
    return () => document.removeEventListener('click', handleClick);
  }, [onOuterClick, innerRef]);

  return (
    <div className={className} ref={innerRef}>
      {children}
    </div>
  );
};

export default ListenOutsideClick;
