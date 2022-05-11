import React, {useCallback, useEffect, useRef} from 'react';
import styles from './index.module.scss';
import {ReactComponent as LeftArrow} from 'assets/images/icons/leftArrow.svg';
import {ReactComponent as RightArrow} from 'assets/images/icons/rightArrow.svg';
import {throttle} from 'lodash-es';

export const Carousel = ({children}) => {
  const carouselChildren = useRef<HTMLDivElement>(null);
  const buttonLeft = useRef<HTMLButtonElement>(null);
  const buttonRight = useRef<HTMLButtonElement>(null);

  let currentElementIndex = 0;

  const getScrollBy = () => {
    const currentElementWidth = getElementWidth(carouselChildren.current.children[currentElementIndex] as HTMLElement);
    return currentElementWidth;
  };

  const getElementWidth = (element: HTMLElement) => {
    const style = element.style;
    const margin = (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
    return element.offsetWidth + margin;
  };

  const maximumScrollLeft = (element: HTMLDivElement) => {
    const leftCutOf = carouselChildren.current.scrollLeft;
    let currentChild = -1;
    let currentPosX = 0;
    let maxScroll = 0;

    while (currentChild < element.children.length && currentPosX < leftCutOf) {
      currentChild += 1;
      maxScroll = currentPosX;
      currentPosX += getElementWidth(element.children[currentChild] as HTMLElement);
    }

    if (currentElementIndex > 0) currentElementIndex--;
    return maxScroll - element.clientWidth;
  };

  const maximumScrollRight = (element: HTMLDivElement) => {
    console.log('element', element);
    const rightCutOf = carouselChildren.current.scrollLeft + element.clientWidth;
    let currentChild = -1;
    let currentPosX = 0;
    let maxScroll = 0;

    while (currentChild < element.children.length && currentPosX < rightCutOf) {
      currentChild += 1;
      maxScroll = currentPosX;

      if (!element.children[currentChild]) {
        currentChild = element.children.length - 1;
      }
      currentPosX += getElementWidth(element.children[currentChild] as HTMLElement);
    }

    if (currentElementIndex < carouselChildren.current.children.length - 1) currentElementIndex++;
    console.log('maxScroll', maxScroll);
    return maxScroll;
  };

  const moveLeft = useCallback(
    throttle(() => {
      carouselChildren.current.scroll({
        left: Math.max(
          carouselChildren.current.scrollLeft - getScrollBy(),
          maximumScrollLeft(carouselChildren.current)
        ),
        behavior: 'smooth',
      });
    }, 1000),
    [carouselChildren]
  );

  const moveRight = useCallback(
    throttle(() => {
      carouselChildren.current.scroll({
        left: Math.max(
          carouselChildren.current.scrollLeft + getScrollBy(),
          maximumScrollRight(carouselChildren.current)
        ),

        behavior: 'smooth',
      });
    }, 1000),
    [carouselChildren]
  );

  const resetScrollButtons = useCallback(() => {
    const element = carouselChildren.current;
    if (buttonLeft.current) {
      console.log('LEFT', element.scrollLeft);
      if (element.scrollLeft > 0) {
        buttonLeft.current.style.display = 'block';
      } else {
        buttonLeft.current.style.display = 'none';
      }
    }
    if (buttonRight.current) {
      if (element.scrollLeft + element.clientWidth < element.scrollWidth && element.scrollWidth > element.clientWidth) {
        buttonRight.current.style.display = 'block';
      } else {
        buttonRight.current.style.display = 'none';
      }
    }
  }, [carouselChildren, buttonLeft, buttonRight]);

  const registerObserver = useCallback(() => {
    const resizeObserver = new ResizeObserver(() => {
      resetScrollButtons();
    });

    if (carouselChildren && carouselChildren.current) {
      resizeObserver.observe(carouselChildren.current);
      resetScrollButtons();
      carouselChildren.current.addEventListener('scroll', () => {
        resetScrollButtons();
      });
    }
  }, [carouselChildren]);

  useEffect(() => {
    setTimeout(registerObserver, 200);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.carouselChildren} ref={carouselChildren}>
        {children}
      </div>
      <div>
        <button ref={buttonLeft} type="button" className={styles.buttonLeft} onClick={moveLeft}>
          <LeftArrow className={styles.scrollButton} title="Scroll left" />
        </button>
        <button ref={buttonRight} type="button" className={styles.buttonRight} onClick={moveRight}>
          <RightArrow className={styles.scrollButton} title="Scroll right" />
        </button>
      </div>
    </div>
  );
};
