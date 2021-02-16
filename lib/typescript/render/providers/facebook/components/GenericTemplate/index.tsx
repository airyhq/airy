import React, {useCallback, useEffect, useRef} from 'react';
import styles from './index.module.scss';
import {DefaultMessageRenderingProps} from '../../../../components/index';
import {GenericTemplate as GenericTemplateModel} from '../../facebookModel';
import {ReactComponent as ChevronLeft} from '../../../../assets/icons/chevron_left.svg';

type GenericTemplateRendererProps = DefaultMessageRenderingProps & {
  template: GenericTemplateModel;
};

export const GenericTemplate = ({sentAt, template}: GenericTemplateRendererProps) => {
  const templatesEl = useRef<HTMLDivElement>(null);
  const buttonEl = useRef<HTMLDivElement>(null);

  const moveLeft = useCallback(() => {
    templatesEl.current.scroll({
      left: templatesEl.current.scrollLeft - 320,
      behavior: 'smooth',
    });
  }, [templatesEl]);

  const moveRight = useCallback(() => {
    templatesEl.current.scroll({
      left: templatesEl.current.scrollLeft + 320,
      behavior: 'smooth',
    });
  }, [templatesEl]);

  const resetScrollButtons = useCallback(() => {
    if (buttonEl.current) {
      if (templatesEl.current.scrollWidth > templatesEl.current.clientWidth) {
        buttonEl.current.style.display = 'block';
      } else {
        buttonEl.current.style.display = 'none';
      }
    }
  }, [templatesEl, buttonEl]);

  const registerObserver = useCallback(() => {
    const resizeObserver = new ResizeObserver(() => {
      resetScrollButtons();
    });
    resizeObserver.observe(templatesEl.current);
    resetScrollButtons();
  }, [templatesEl]);

  useEffect(() => {
    setTimeout(registerObserver, 200);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.templates} ref={templatesEl}>
        {template.elements.map((element, idx) => (
          <div key={`template-${idx}`} className={styles.template}>
            {element.image_url?.length && <img className={styles.templateImage} src={element.image_url} />}
            <div className={styles.innerTemplate}>
              <div className={styles.templateTitle}>{element.title}</div>
              <div className={styles.templateSubtitle}>{element.subtitle}</div>
              {element.buttons.map((button, idx) => {
                return (
                  <div key={`button-${idx}`} className={styles.button}>
                    {button.type == 'web_url' && button.url.length ? (
                      <a href={button.url} target="_blank" rel="noreferrer" className={styles.buttonText}>
                        {button.title}
                      </a>
                    ) : (
                      <div className={styles.buttonText}>{button.title}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {template.elements.length > 1 && (
        <div ref={buttonEl}>
          <button type="button" className={styles.buttonLeft} onClick={moveLeft}>
            <ChevronLeft className={styles.scrollLeft} title="Scroll left" />
          </button>
          <button type="button" className={styles.buttonRight} onClick={moveRight}>
            <ChevronLeft className={styles.scrollRight} title="Scroll right" />
          </button>
        </div>
      )}
      {sentAt && <div className={styles.messageTime}>{sentAt}</div>}
    </div>
  );
};
