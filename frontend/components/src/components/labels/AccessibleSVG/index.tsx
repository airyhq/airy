import React, {useCallback, memo} from 'react';
import {ReactSVG} from 'react-svg';

export const AccessibleSVG = memo(({src, title, description, ariaHidden, wrapper, className}: svgProps) => {
  const updateOrCreateNode = useCallback((svg, nodeName, content) => {
    let node = svg.getElementsByTagName(nodeName)[0];
    if (node) {
      if (!content) {
        node.remove();
      } else {
        node.innerHTML = content;
      }
    } else if (content) {
      node = document.createElement(nodeName);
      node.appendChild(document.createTextNode(content));
      svg.insertBefore(node, svg.firstChild);
    }
  }, []);

  return (
    <ReactSVG
      src={src}
      wrapper={wrapper}
      className={className}
      beforeInjection={svg => {
        svg.setAttribute('role', 'img');
        if (ariaHidden && typeof ariaHidden == 'string') {
          svg.setAttribute('aria-hidden', ariaHidden);
        }

        updateOrCreateNode(svg, 'desc', description);
        updateOrCreateNode(svg, 'title', title);
      }}
    />
  );
});

type svgProps = {
  /** Source of the svg */
  src: string;
  /** Accessible title for this svg */
  title?: string;
  /** Description of this svg */
  description?: string;
  /** if this does not need a description set this to true */
  ariaHidden?: string | true;
  /** The wrapper element, defaults to div */
  wrapper?: 'div' | 'span';
  /** The classname to style the SVG if needed */
  className?: string;
};
