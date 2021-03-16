import React, {useEffect} from 'react';

export default ({src, id, ...props}) => {
  const anchorId = 'script-anchor-' + id;
  useEffect(() => {
    const script = document.createElement('script');

    script.src = src;
    script.async = true;
    script.id = id;

    Object.keys(props).forEach(key => {
      script.setAttribute(key, props[key]);
    });

    document.getElementById(anchorId).appendChild(script);

    return () => {
      document.getElementById(anchorId).removeChild(script);
    };
  }, [src, id]);

  return <div id={anchorId} />;
};
