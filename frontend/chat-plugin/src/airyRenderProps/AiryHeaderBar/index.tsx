import {h} from 'preact';
import style from './index.module.scss';

type Props = {
  toggleHideChat: () => void;
};

const AiryHeaderBar: React.FC<Props> = (props: Props): JSX.Element => {
  return (
    <div className={style.header}>
      <div className={style.headerInfo}>
        <h1 className={style.headerTitle}>Customer Chat</h1>
      </div>
      <button className={style.closeButton} onClick={() => props.toggleHideChat()}>
        <svg width="10px" height="10px" viewBox="0 0 10 10" version="1.1">
          <g id="Page-1" stroke="#FFF" strokeWidth="1" fill="#FFF" fillRule="evenodd">
            <path
              d="M5,4.2928932 L9.1464466,0.14644661 C9.3417088,-0.04881554 9.6582912,-0.04881554 9.8535534,0.14644661 C10.0488155,0.34170876 10.0488155,0.65829124 9.8535534,0.85355339 L5.7071068,5 L9.8535534,9.1464466 C10.0488155,9.3417088 10.0488155,9.6582912 9.8535534,9.8535534 C9.6582912,10.0488155 9.3417088,10.0488155 9.1464466,9.8535534 L5,5.7071068 L0.85355339,9.8535534 C0.65829124,10.0488155 0.34170876,10.0488155 0.14644661,9.8535534 C-0.04881554,9.6582912 -0.04881554,9.3417088 0.14644661,9.1464466 L4.2928932,5 L0.14644661,0.85355339 C-0.04881554,0.65829124 -0.04881554,0.34170876 0.14644661,0.14644661 C0.34170876,-0.04881554 0.65829124,-0.04881554 0.85355339,0.14644661 L5,4.2928932 Z"
              id="close"
              fill="#FFF"
              fillRule="nonzero"></path>
          </g>
        </svg>
      </button>
    </div>
  );
};

export default AiryHeaderBar;
