import React, {Component, Fragment} from 'react';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmark.svg';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';
import {ReactComponent as SmileyIcon} from 'assets/images/icons/smiley.svg';
import {ReactComponent as InfoCircle} from 'assets/images/icons/infoCircle.svg';
import {useTranslation} from 'react-i18next';
import styles from './style.module.scss';

const Translation = ({text}: {text: string}) => {
  const {t} = useTranslation();
  if (typeof text !== 'string') return;
  return <>{t(text)}</>;
};

class InputComponent extends Component<InputProps, IState> {
  public static defaultProps = {
    height: 48,
    fontClass: 'font-l',
    label: '',
    autoFocus: false,
    hideLabel: false,
    showCounter: true,
  };

  inputRef: React.RefObject<HTMLInputElement>;
  node: HTMLDivElement;

  constructor(props) {
    super(props);
    this.state = {
      validationResult: undefined,
      wasBlurred: false,
      isShowingEmojiDrawer: false,
    };
    this.inputRef = React.createRef();
  }

  componentDidMount = () => {
    const {inputRef, value} = this.props;
    if (value) {
      this.validateInput((inputRef || this.inputRef).current);
    }
  };

  componentDidUpdate = prevProps => {
    const inputRef = this.props.inputRef || this.inputRef;
    if ((inputRef.current && !prevProps.showErrors && this.props.showErrors) || this.props.value !== prevProps.value) {
      this.validateInput(inputRef.current);
    }
  };

  translateResult = (type, validity) => {
    if (validity.valueMissing) {
      return 'fieldCannotBeEmpty';
    } else if (type === 'url' && validity.typeMismatch) {
      return 'invalidURL';
    } else {
      return validity.valid;
    }
  };

  checkWithHTML5Validation = inputElement => {
    if (inputElement === null || !this.hasValidations()) {
      return;
    }
    inputElement.checkValidity();
    this.setState({validationResult: inputElement.validity.valid});
    if (inputElement.type === 'email') {
      if (!inputElement.validity.valid) {
        this.setState({
          validationResult: 'invalidEmail',
        });
      } else {
        this.setState({validationResult: true});
      }
    } else {
      this.setState({
        validationResult: this.translateResult(inputElement.type, inputElement.validity),
      });
    }
  };

  hasValidations = () => {
    return (
      this.props.type === 'url' ||
      this.props.type === 'email' ||
      this.props.required ||
      this.props.minLength ||
      this.props.maxLength ||
      this.props.validation
    );
  };

  checkWithValidationFunction = inputElement => {
    const {validation} = this.props;
    const validationResult = validation(inputElement.value);
    this.setState({validationResult: validationResult});
    if (validationResult === true) {
      inputElement.setCustomValidity('');
    } else {
      inputElement.setCustomValidity(validationResult);
    }
  };

  checkWithURLValidation = inputElement => {
    this.checkWithHTML5Validation(inputElement);

    if (!this.props.required && inputElement.value.length == 0) {
      inputElement.setCustomValidity('');
      return;
    }

    if (!new RegExp('^https?://(.*)').test(inputElement.value)) {
      this.setState({
        validationResult: 'invalidURL',
      });
      inputElement.setCustomValidity('invalidURL');
    } else {
      inputElement.setCustomValidity('');
    }
  };

  validateInput = inputElement => {
    const {validation, type} = this.props;
    if (validation) {
      this.checkWithValidationFunction(inputElement);
    } else if (type === 'url') {
      this.checkWithURLValidation(inputElement);
    } else {
      this.checkWithHTML5Validation(inputElement);
    }
  };

  onChange = event => {
    const {onChange} = this.props;
    this.validateInput(event.target);
    if (onChange) {
      onChange(event);
    }
  };

  onBlur = event => {
    const {onBlur} = this.props;
    this.setState({wasBlurred: true});
    this.validateInput(event.target);
    if (onBlur) {
      onBlur(event);
    }
  };

  getCurrentValidationState = () => {
    if (this.state.validationResult === true) {
      return 'inputValid';
    } else if (this.state.validationResult === undefined) {
      return null;
    }

    if (!this.state.wasBlurred && !this.props.showErrors) {
      return null;
    }

    return 'inputInvalid';
  };

  classForState = () => {
    switch (this.getCurrentValidationState()) {
      case 'inputInvalid':
        return styles.inputInvalid;
      case 'inputValid':
        return styles.inputValid;
      default:
        return '';
    }
  };

  iconForState = () => {
    if (this.state.validationResult === true) {
      return (
        <div className={styles.icon}>
          <CheckmarkIcon aria-hidden="true" />
        </div>
      );
    } else if (this.state.validationResult === undefined) {
      return null;
    }

    if (!this.state.wasBlurred && !this.props.showErrors) {
      return null;
    }

    return (
      <div className={styles.closeIcon}>
        <CloseIcon aria-hidden="true" />
      </div>
    );
  };

  addListeners = () => {
    document.addEventListener('keydown', this.handleEmojiKeyEvent);
    document.addEventListener('click', this.handleEmojiOutsideClick);
  };

  removeListeners = () => {
    document.removeEventListener('keydown', this.handleEmojiKeyEvent);
    document.removeEventListener('click', this.handleEmojiOutsideClick);
  };

  handleEmojiDrawer = () => {
    if (!this.state.isShowingEmojiDrawer) {
      this.addListeners();
    } else {
      this.removeListeners();
      this.inputRef.current && this.inputRef.current.focus();
    }

    this.setState({isShowingEmojiDrawer: !this.state.isShowingEmojiDrawer});
  };

  handleEmojiKeyEvent = e => {
    if (e.key === 'Escape') {
      this.handleEmojiDrawer();
    }
  };

  handleEmojiOutsideClick = e => {
    if (this.node && this.node.contains(e.target)) {
      return;
    }
    this.handleEmojiDrawer();
  };

  addEmoji = emoji => {
    let message = emoji.native;
    const inputRef = this.props.inputRef || this.inputRef;
    if (this.props.value) {
      message = this.props.value + ' ' + message;
    }

    inputRef.current.value = message;

    this.onChange({target: inputRef.current});

    this.handleEmojiDrawer();
  };

  emojiDrawer = () => {
    const Picker = () => this.props.renderEmojiPicker(this.addEmoji);
    return (
      <div
        ref={node => {
          this.node = node;
        }}
        className={styles.emojiDrawer}
      >
        <Picker />
      </div>
    );
  };

  render() {
    const {
      id,
      label,
      showLabelIcon,
      tooltipText,
      tooltipStyle,
      hideLabel,
      name,
      value,
      checked,
      placeholder,
      hint,
      height,
      type,
      inputRef,
      inputmode,
      minLength,
      maxLength,
      minWidth,
      width,
      showErrors,
      children,
      fontClass,
      inputComponent,
      autoFocus,
      required,
      autoComplete,
      disabled,
      onKeyDown,
      pattern,
      showCounter,
      onFocus,
      dataCy,
      min,
      max,
      step,
    } = this.props;

    const {validationResult, wasBlurred} = this.state;
    const labelClass = `${this.classForState()} ${styles.label}`;
    const inputClass = `${styles[fontClass]} ${styles.inputInner} `;

    return (
      <label className={labelClass}>
        <div className={styles.inputTitleRow}>
          {!hideLabel && (
            <div className={styles.inputTitle}>
              {children ? (
                children(this.iconForState())
              ) : (
                <Fragment>
                  {label} {this.iconForState()}
                </Fragment>
              )}
              {showLabelIcon && (
                <>
                  <InfoCircle width={20} className={styles.infoCircle} />
                  {tooltipText && <span className={`${styles.infoCircleText} ${tooltipStyle}`}>{tooltipText}</span>}
                </>
              )}
            </div>
          )}
          {this.props.maxLength > 0 && this.props.showCounter ? (
            <div className={styles.inputMaxLength}>
              <span className={value.length > this.props.maxLength ? styles.inputMaxLengthError : ''}>
                {Math.max(0, this.props.maxLength - value.length)}
              </span>
            </div>
          ) : (
            ''
          )}
        </div>
        {inputComponent ? (
          inputComponent({
            id: id,
            inputRef: inputRef || this.inputRef,
            placeholder: placeholder,
            onChange: this.onChange,
            onBlur: this.onBlur,
            onKeyDown: onKeyDown,
            type: type,
            value: value,
            checked: checked,
            autoFocus: autoFocus,
            name: name,
            minLength: minLength,
            maxLength: maxLength,
            required: required,
            fontClass: fontClass,
            pattern: pattern,
            currentValidationState: this.getCurrentValidationState(),
            showCounter: showCounter,
          })
        ) : (
          <div className={`${styles.input} ${tooltipText ? styles.tooltipMargin : ''}`}>
            <input
              id={id}
              ref={inputRef || this.inputRef}
              className={inputClass}
              checked={checked}
              placeholder={placeholder}
              onChange={this.onChange}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              onBlur={this.onBlur}
              style={{
                height: `${height}px`,
                minWidth: `${minWidth}px`,
                width: `${width}px`,
              }}
              type={type}
              value={value}
              autoFocus={autoFocus}
              name={name}
              minLength={minLength}
              maxLength={maxLength}
              required={required}
              autoComplete={autoComplete}
              disabled={disabled}
              pattern={pattern}
              inputMode={inputmode}
              data-cy={dataCy}
              step={step}
              min={min}
              max={max}
            />
            {this.props.renderEmojiPicker ? (
              <div className={styles.emojiWrapper}>
                {this.state.isShowingEmojiDrawer && this.emojiDrawer()}
                <button
                  type="button"
                  onClick={this.handleEmojiDrawer}
                  disabled={this.props.maxLength - value.length <= 0}
                  className={`${styles.emojiIcon} ${this.state.isShowingEmojiDrawer && styles.emojiIconActive}`}
                >
                  <SmileyIcon title="Emoji" className={styles.smileyIcon} />
                </button>
              </div>
            ) : null}
          </div>
        )}
        <div className={styles.inputHint} data-testid="input-hint">
          {typeof validationResult === 'string' || wasBlurred || showErrors ? (
            <span>
              <Translation text={validationResult as string} />
            </span>
          ) : (
            <span>{hint}</span>
          )}
        </div>
      </label>
    );
  }
}

export interface InputProps {
  /** Pass an emoji picker component to render have it rendered and work with the input */
  renderEmojiPicker?: (onSelect: (emoji: string) => void) => JSX.Element;

  id?: string;
  step?: number;
  min?: number;
  max?: number;

  /** The label above the input field */
  label?: string;
  showLabelIcon?: boolean;
  tooltipText?: string;
  tooltipStyle?: string;
  minWidth?: number;
  width?: number;

  /** Want to hide the label completely? */
  hideLabel?: boolean;

  /** An addional hint below the input field */
  hint?: string;
  value?: string;
  checked?: boolean;
  name?: string;
  placeholder?: string;
  /**
   * validation function. Should return true if valid,
   * undefined if neutral and a string explaining
   * what is wrong otherwise
   **/
  validation?: any;
  type?: string;
  autoFocus?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  /** Minimum length for validation */
  minLength?: number;
  maxLength?: number;
  /** true if this is a required input, defaults to false */
  required?: boolean;
  /** If we wish to disable the input field for further input or validation related issues */
  disabled?: boolean;

  pattern?: string;
  /**
   * usually the field only shows the error after a blur event,
   * but if you want to show errors on all fields after a submit button
   * was pressed, simply set this state to true and the error is shown.
   */
  showErrors?: boolean;
  height?: number;

  // Since tuning font size is not the most common operation, this should suffice for now
  fontClass?: 'font-base' | 'font-s' | 'font-m' | 'font-l' | 'font-xl' | 'font-xxl';

  /**
   * If you want to modify the label, you can add a function here. It will
   * receive the icon as the first value of the function
   */
  children?: any;

  /**
   * You can replace the input tag with a custom rendered version with this function. See
   * `Textarea` for an implementation example.
   */
  inputComponent?: any;

  // If you want to enable browser suggestions on the input
  autoComplete?: string;

  // set this to true if you want to display the length counter
  showCounter?: boolean;

  // html5 input mode
  inputmode?: 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';

  // a handle for Cypress
  dataCy?: string;
}

interface IState {
  validationResult: string | boolean;
  wasBlurred: boolean;
  isShowingEmojiDrawer: boolean;
}

export const Input = InputComponent;
