import React, {useEffect} from 'react';

export default ({src, id, attributes}) => {
  const anchorId = 'script-anchor-' + id;
  useEffect(() => {
    const script = document.createElement('script');

    script.src = src;
    script.async = true;
    if (id) {
      script.id = id;
    }

    Object.keys(attributes).forEach(key => {
      script.setAttribute(key, attributes[key]);
    });

    document.getElementById(anchorId).appendChild(script);

    return () => {
      document.getElementById(anchorId).removeChild(script);
    };
  }, [src, id]);

  return <div id={anchorId} />;
};
