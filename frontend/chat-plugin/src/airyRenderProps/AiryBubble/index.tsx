import {h} from 'preact';
import style from './index.module.scss';

type Props = {
  isChatHidden: boolean;
  toggleHideChat: () => void;
};

const AiryBubble = (props: Props) => {
  return (
    <div className={style.hideBubble} onClick={() => props.toggleHideChat()}>
      {!props.isChatHidden ? (
        <svg width="10px" height="10px" className={style.hideBubbleCross} viewBox="0 0 10 10" version="1.1">
          <g id="Page-1" stroke="#FFF" strokeWidth="0" fill="#FFF" fillRule="evenodd">
            <path
              d="M5,4.2928932 L9.1464466,0.14644661 C9.3417088,-0.04881554 9.6582912,-0.04881554 9.8535534,0.14644661 C10.0488155,0.34170876 10.0488155,0.65829124 9.8535534,0.85355339 L5.7071068,5 L9.8535534,9.1464466 C10.0488155,9.3417088 10.0488155,9.6582912 9.8535534,9.8535534 C9.6582912,10.0488155 9.3417088,10.0488155 9.1464466,9.8535534 L5,5.7071068 L0.85355339,9.8535534 C0.65829124,10.0488155 0.34170876,10.0488155 0.14644661,9.8535534 C-0.04881554,9.6582912 -0.04881554,9.3417088 0.14644661,9.1464466 L4.2928932,5 L0.14644661,0.85355339 C-0.04881554,0.65829124 -0.04881554,0.34170876 0.14644661,0.14644661 C0.34170876,-0.04881554 0.65829124,-0.04881554 0.85355339,0.14644661 L5,4.2928932 Z"
              id="close"
              fill="#FFF"
              fillRule="nonzero"></path>
          </g>
        </svg>
      ) : (
        <svg height="40" className={style.bubbleIcon} viewBox="0 0 39 40" width="39" xmlns="http://www.w3.org/2000/svg">
          <g fill="#fff" fillRule="evenodd" transform="translate(.030165 .02054)">
            <path d="m37.1887765 33.360495-10.066549 4.0324258-13.4940785-33.36076733 10.066549-4.03215347z" />
            <path d="m17.3157765 18.1023243-11.86678434 4.7221039 7.08317644-16.54846533z" />
            <path d="m25.3931725 38.0753564-19.37490191-13.3660891 12.03396081-4.7839109z" />
            <path d="m11.5947451 30.9400594-11.5947451 4.6153713 4.16898039-9.7363614z" />
          </g>
        </svg>
      )}
    </div>
  );
};

export default AiryBubble;
