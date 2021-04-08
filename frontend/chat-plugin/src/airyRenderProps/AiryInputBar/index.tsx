import React, {ChangeEvent, FormEvent, KeyboardEvent, createRef, useEffect} from 'react';
import style from './index.module.scss';
import {cyInputbarTextarea, cyInputbarButton} from 'chat-plugin-handles';

type AiryInputBarProps = {
  sendMessage: (text: string) => void;
  messageString: string;
  setMessageString: (text: string) => void;
  setNewConversation: React.Dispatch<React.SetStateAction<boolean>>;
};

const AiryInputBar = (props: AiryInputBarProps) => {
  const textInputRef = createRef<HTMLTextAreaElement>();
  const dataCyButtonId = cyInputbarButton;
  const dataCyTextareaId = cyInputbarTextarea;

  useEffect(() => {
    if (textInputRef.current === null) {
      return;
    }
    textInputRef.current.selectionStart = props.messageString.length;
    textInputRef.current.selectionEnd = props.messageString.length;
  }, [props.messageString, textInputRef]);

  const resizeTextarea = () => {
    const textArea = textInputRef.current;
    if (textArea) {
      const outerHeight = parseInt(window.getComputedStyle(textArea).height, 10);
      const diff = outerHeight - textArea.clientHeight;
      // Set this to 0 first to get the calculation correct. Sadly this is needed.
      textArea.style.height = '0';
      textArea.style.height = Math.min(128, textArea.scrollHeight + diff) + 'px';
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (props.messageString.length) {
      props.setMessageString('');
      props.sendMessage(props.messageString);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    resizeTextarea();
    props.setMessageString(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    resizeTextarea();
    if (event.key === 'Enter') {
      const localValue = event.currentTarget.value;
      if (localValue.length) {
        event.preventDefault();
        props.setMessageString('');
        props.sendMessage(localValue);
      }
    }
  };

  return (
    <form className={style.inputBar} onSubmit={onSubmit}>
      <textarea
        ref={textInputRef}
        className={style.textArea}
        placeholder={'Enter a message...'}
        autoFocus={true}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={props.messageString}
        data-cy={dataCyTextareaId}
      />

      <button className={style.sendButton} type="submit" data-cy={dataCyButtonId}>
        <svg width="32px" height="28px" version="1.1" viewBox="0 0 32 32">
          <g id="send" fill="#FFF">
            <path d="M 4.204896700000001 4.1195648527004405 L 4.0115967 3.9293212999999954 L 26.806220699999997 15.60647032325003 C 27.038809399999998 15.725619970668763 27.222648999999997 15.941497277564224 27.320137699999997 16.20994757774927 C 27.3590557 16.317114218006374 27.382557300000002 16.427165455874935 27.391807 16.536902967267633 L 27.398838400000002 16.540668482394658 L 27.392079699999996 16.54018877934823 C 27.3921007 16.54044645882842 27.392121699999997 16.54070402439193 27.3921426 16.54096170387211 L 27.398838400000002 16.540668482394658 L 27.392382599999998 16.543964319141168 C 27.4304225 17.027113800145607 27.192606599999998 17.50284650930388 26.7783607 17.698066169454904 L 5.363240899999999 27.790260720697574 L 4 28.4862211 L 5.5693217 19.257384836767415 C 5.746012199999999 18.218306686439767 6.5275848 17.45467240775926 7.4559937000000005 17.414015096886477 L 15.929362999999999 17.042945253761246 L 15.9669189 17.00707039202062 C 16.2459878 16.993653971552554 16.4762258 16.753711315008147 16.5127314 16.438251711105558 C 16.5480464 16.133081515411554 16.3928866 15.84932685398698 16.1518743 15.74236389671421 L 7.4157525 15.122277821325797 C 6.5061810000000015 15.057716808541617 5.7499406 14.30085293859034 5.576627500000001 13.281636271485022 L 4 4.009836112890403 L 4.204896700000001 4.1195648527004405 Z" />
          </g>
        </svg>
      </button>
    </form>
  );
};

export default AiryInputBar;
