import React from 'react';
import {Config} from '../../config';
import style from './index.module.scss';

type Props = {
  isChatHidden: boolean;
  toggleHideChat: () => void;
  dataCyId?: string;
  config?: Config;
  unreadMessage: boolean;
};

const AiryBubble = (props: Props) => {
  const {config, unreadMessage} = props;

  const BubbleImage = () => {
    return (
      <>
        {(config.showMode || unreadMessage) && (
          <>
            <div
              style={{
                position: 'absolute',
                right: 10,
                height: '16px',
                width: '16px',
                backgroundColor: config.unreadMessageDotColor || 'red',
                borderRadius: '8px',
                zIndex: 1,
              }}
            />
          </>
        )}
        {config?.bubbleIcon ? (
          <img
            style={{
              maxHeight: '60px',
              maxWidth: '60px',
              objectFit: 'contain',
            }}
            src={config.bubbleIcon}
          />
        ) : (
          <svg
            height="40"
            className={style.bubbleIcon}
            viewBox="0 0 39 40"
            width="39"
            xmlns="http://www.w3.org/2000/svg">
            <g fill="#fff" fillRule="evenodd" transform="translate(.030165 .02054)">
              <path d="m37.1887765 33.360495-10.066549 4.0324258-13.4940785-33.36076733 10.066549-4.03215347z" />
              <path d="m17.3157765 18.1023243-11.86678434 4.7221039 7.08317644-16.54846533z" />
              <path d="m25.3931725 38.0753564-19.37490191-13.3660891 12.03396081-4.7839109z" />
              <path d="m11.5947451 30.9400594-11.5947451 4.6153713 4.16898039-9.7363614z" />
            </g>
          </svg>
        )}
      </>
    );
  };

  return (
    <div
      className={style.hideBubble}
      style={props.isChatHidden ? {height: '60px', display: 'block'} : {}}
      onClick={() => props.toggleHideChat()}
      data-cy={props.dataCyId}>
      {!props.isChatHidden ? (
        <svg width="24px" height="60px" viewBox="0 0 10 6" version="1.1">
          <g id="Page-1" stroke="none" strokeWidth="1" fill="#ffffff" fillRule="evenodd">
            <g
              id="chevron-down"
              transform="translate(1.000000, 1.000000)"
              fill="#ffffff"
              fillRule="nonzero"
              stroke="#ffffff">
              <path
                d="M7.1746043,0.1203717 C7.3842672,-0.05933938 7.6999172,-0.03505861 7.8796283,0.1746043 C8.0593394,0.3842672 8.0350586,0.6999172 7.8253957,0.8796283 L4.3253957,3.8796283 C4.1381508,4.0401239 3.8618492,4.0401239 3.6746043,3.8796283 L0.17460431,0.8796283 C-0.03505861,0.6999172 -0.05933938,0.3842672 0.1203717,0.1746043 C0.30008277,-0.03505861 0.61573277,-0.05933938 0.82539569,0.1203717 L3.99999093,2.8414611 L7.1746043,0.1203717 Z"
                id="Path"
              />
            </g>
          </g>
        </svg>
      ) : (
        <BubbleImage />
      )}
    </div>
  );
};

export default AiryBubble;
