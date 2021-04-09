import React, {Component, Fragment} from 'react';
import {Picker} from 'emoji-mart';

import styles from './style.module.scss';
import {ReactComponent as CheckmarkIcon} from '../../../assets/images/icons/checkmark.svg';
import {ReactComponent as CloseIcon} from '../../../assets/images/icons/close.svg';
import {ReactComponent as SmileyIcon} from '../../../assets/images/icons/smiley.svg';

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
    if (!!value) {
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
      return 'This field cannot be empty.';
    } else if (type === 'url' && validity.typeMismatch) {
      return 'The URL is invalid';
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
          validationResult: 'This doesn’t look like an email address.',
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

    /**
     * In #1106 Thomas described that he also wants to prevent
     * People to enter urls like http://example , which in itself
     * is a valid url based on the specs, but we want to make sure
     * the users also enter at least a domain + tld, so we check here
     * if there is a dot inside of the field just to be save.
     */
    if (!inputElement.value.match(/.*\w\.\w.*/)) {
      this.setState({
        validationResult: 'The URL is invalid',
      });
      inputElement.setCustomValidity('The URL is invalid');
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
      <div className={styles.icon}>
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

    this.onChange({
      persist: () => {},
      target: inputRef.current,
    });

    this.handleEmojiDrawer();
  };

  emojiDrawer = () => {
    return (
      <div
        ref={node => {
          this.node = node;
        }}
        className={styles.emojiDrawer}>
        <Picker
          showPreview={false}
          onSelect={this.addEmoji}
          title="Emoji"
          style={{right: '28px', position: 'absolute', bottom: '-84px'}}
        />
      </div>
    );
  };

  render() {
    const {
      id,
      label,
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
          <div className={styles.input}>
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
            />
            {this.props.emoji ? (
              <div className={styles.emojiWrapper}>
                {this.state.isShowingEmojiDrawer && this.emojiDrawer()}
                <button
                  type="button"
                  onClick={this.handleEmojiDrawer}
                  disabled={this.props.maxLength - value.length <= 0}
                  className={`${styles.emojiIcon} ${this.state.isShowingEmojiDrawer && styles.emojiIconActive}`}>
                  <SmileyIcon title="Emoji" />
                </button>
              </div>
            ) : null}
          </div>
        )}
        <div className={styles.inputHint}>
          {typeof validationResult === 'string' && (wasBlurred || showErrors) ? validationResult : hint}
        </div>
      </label>
    );
  }
}

export interface InputProps {
  id?: string;
  /** The label above the input field */
  label?: string;

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

  // set this to true if you want to have an emoji button
  emoji?: boolean;

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
