import React, { useEffect, useRef } from "react";

type ListenOutsideClickProps = {
  children: React.ReactNode;
  className?: string;
  onOuterClick: (event: React.MouseEvent<HTMLElement>) => void;
};

const ListenOutsideClick = ({
  children,
  className,
  onOuterClick
}: ListenOutsideClickProps) => {
  const innerRef = useRef(null);

  useEffect(() => {
    const handleClick = event => {
      innerRef.current &&
        !innerRef.current.contains(event.target) &&
        onOuterClick(event);
    };

    // only add listener, if the element exists
    if (innerRef.current) {
      document.addEventListener("click", handleClick);
    }

    // unmount previous first in case inputs have changed
    return () => document.removeEventListener("click", handleClick);
  }, [onOuterClick, innerRef]);

  return (
    <div className={className} ref={innerRef}>
      {children}
    </div>
  );
};

export default ListenOutsideClick;
