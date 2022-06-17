import {useLocalState} from '../../../../../../../../services';
import {DefaultColors} from 'model';
import React, {Dispatch, SetStateAction} from 'react';
import {useTranslation} from 'react-i18next';
import {ColorPicker} from './ColorPicker';
import {ColorPickerSample} from './ColorPickerSample';
import {ModalColorPicker} from './ModalColorPicker';
import {SampleInput} from './SampleInput';
import styles from './index.module.scss';
import {Dropdown} from 'components';

type ColorSectionProps = {
  headerTextColor: string;
  setHeaderTextColor: Dispatch<SetStateAction<string>>;
  subtitleTextColor: string;
  setSubtitleTextColor: Dispatch<SetStateAction<string>>;
  primaryColor: string;
  setPrimaryColor: Dispatch<SetStateAction<string>>;
  accentColor: string;
  setAccentColor: Dispatch<SetStateAction<string>>;
  backgroundColor: string;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  inboundMessageColor: string;
  setInboundMessageColor: Dispatch<SetStateAction<string>>;
  inboundMessageTextColor: string;
  setInboundMessageTextColor: Dispatch<SetStateAction<string>>;
  outboundMessageColor: string;
  setOutboundMessageColor: Dispatch<SetStateAction<string>>;
  outboundMessageTextColor: string;
  setOutboundMessageTextColor: Dispatch<SetStateAction<string>>;
  unreadMessageDotColor: string;
  setUnreadMessageDotColor: Dispatch<SetStateAction<string>>;
  setColorStepText: Dispatch<SetStateAction<string>>;
};

export const ColorSection = (props: ColorSectionProps) => {
  const {
    headerTextColor,
    subtitleTextColor,
    primaryColor,
    accentColor,
    backgroundColor,
    inboundMessageColor,
    inboundMessageTextColor,
    outboundMessageColor,
    outboundMessageTextColor,
    unreadMessageDotColor,
    setHeaderTextColor,
    setSubtitleTextColor,
    setPrimaryColor,
    setAccentColor,
    setBackgroundColor,
    setInboundMessageColor,
    setInboundMessageTextColor,
    setOutboundMessageColor,
    setOutboundMessageTextColor,
    setUnreadMessageDotColor,
  } = props;

  const {t} = useTranslation();
  const [activeColorStep, setActiveColorStep] = useLocalState('activeColorStep', 0);
  const [colorStepText, setColorStepText] = useLocalState('colorStepText', `${t('headerTextColor')}`);
  const colorStepsArr = [
    t('headerTextColor'),
    t('subtitleTextColor'),
    t('primaryColor'),
    t('accentColor'),
    t('backgroundColor'),
    t('inboundBackgroundColor'),
    t('inboundMessageTextColor'),
    t('outboundBackgroundColor'),
    t('outboundMessageTextColor'),
    t('unreadMessageDotColor'),
  ];

  const [showHeaderTextColorPicker, setShowHeaderTextColorPicker] = useLocalState('showHeaderTextColorPicker', false);
  const [showSubtitleTextColorPicker, setShowSubtitleTextColorPicker] = useLocalState(
    'showSubtitleTextColorPicker',
    false
  );
  const [showPrimaryColorPicker, setShowPrimaryColorPicker] = useLocalState('showPrimaryColorPicker', false);
  const [showAccentColorPicker, setShowAccentColorPicker] = useLocalState('showAccentColorPicker', false);

  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useLocalState('showBackgroundColorPicker', false);
  const [showInboundMessageColorPicker, setShowInboundMessageColorPicker] = useLocalState(
    'showInboundMessageColorPicker',
    false
  );
  const [showInboundMessageTextColorPicker, setShowInboundMessageTextColorPicker] = useLocalState(
    'showInboundMessageTextColorPicker',
    false
  );
  const [showOutboundMessageColorPicker, setShowOutboundMessageColorPicker] = useLocalState(
    'showOutboundMessageColorPicker',
    false
  );
  const [showOutboundMessageTextColorPicker, setShowOutboundMessageTextColorPicker] = useLocalState(
    'showOutboundMessageTextColorPicker',
    false
  );
  const [showUnreadMessageDotColorPicker, setShowUnreadMessageDotColorPicker] = useLocalState(
    'showUnreadMessageDotColorPicker',
    false
  );

  const toggleShowHeaderTextColorPicker = () => {
    setShowHeaderTextColorPicker(!showHeaderTextColorPicker);
  };

  const toggleShowSubtitleTextColorPicker = () => {
    setShowSubtitleTextColorPicker(!showSubtitleTextColorPicker);
  };

  const toggleShowPrimaryColorPicker = () => {
    setShowPrimaryColorPicker(!showPrimaryColorPicker);
  };

  const toggleShowAccentColorPicker = () => {
    setShowAccentColorPicker(!showAccentColorPicker);
  };

  const toggleShowBackgroundColorPicker = () => {
    setShowBackgroundColorPicker(!showBackgroundColorPicker);
  };

  const toggleShowInboundMessageColorPicker = () => {
    setShowInboundMessageColorPicker(!showInboundMessageColorPicker);
  };

  const toggleShowInboundMessageTextColorPicker = () => {
    setShowInboundMessageTextColorPicker(!showInboundMessageTextColorPicker);
  };

  const toggleShowOutboundMessageColorPicker = () => {
    setShowOutboundMessageColorPicker(!showOutboundMessageColorPicker);
  };

  const toggleShowOutboundMessageTextColorPicker = () => {
    setShowOutboundMessageTextColorPicker(!showOutboundMessageTextColorPicker);
  };
  const toggleShowUnreadMessageDotColorPicker = () => {
    setShowUnreadMessageDotColorPicker(!showUnreadMessageDotColorPicker);
  };

  const handleColorStepChange = (stepText: string) => {
    switch (stepText) {
      case t('headerTextColor'):
        setActiveColorStep(0);
        setColorStepText(`${t('headerTextColor')}`);
        props.setColorStepText(`${t('headerTextColor')}`);
        break;
      case t('subtitleTextColor'):
        setActiveColorStep(1);
        setColorStepText(`${t('subtitleTextColor')}`);
        props.setColorStepText(`${t('subtitleTextColor')}`);
        break;
      case t('primaryColor'):
        setActiveColorStep(2);
        setColorStepText(`${t('primaryColor')}`);
        props.setColorStepText(`${t('primaryColor')}`);
        break;
      case t('accentColor'):
        setActiveColorStep(3);
        setColorStepText(`${t('accentColor')}`);
        props.setColorStepText(`${t('accentColor')}`);
        break;
      case t('backgroundColor'):
        setActiveColorStep(4);
        setColorStepText(`${t('backgroundColor')}`);
        props.setColorStepText(`${t('backgroundColor')}`);
        break;
      case t('inboundBackgroundColor'):
        setActiveColorStep(5);
        setColorStepText(`${t('inboundBackgroundColor')}`);
        props.setColorStepText(`${t('inboundBackgroundColor')}`);
        break;
      case t('inboundMessageTextColor'):
        setActiveColorStep(6);
        setColorStepText(`${t('inboundMessageTextColor')}`);
        props.setColorStepText(`${t('inboundMessageTextColor')}`);
        break;
      case t('outboundBackgroundColor'):
        setActiveColorStep(7);
        setColorStepText(`${t('outboundBackgroundColor')}`);
        props.setColorStepText(`${t('outboundBackgroundColor')}`);
        break;
      case t('outboundMessageTextColor'):
        setActiveColorStep(8);
        setColorStepText(`${t('outboundMessageTextColor')}`);
        props.setColorStepText(`${t('outboundMessageTextColor')}`);
        break;
      case t('unreadMessageDotColor'):
        setActiveColorStep(9);
        setColorStepText(`${t('unreadMessageDotColor')}`);
        props.setColorStepText(`${t('unreadMessageDotColor')}`);
        break;
    }
  };

  return (
    <div className={styles.colorContainer}>
      <div className={styles.dropdownInputContainer}>
        <div className={styles.stepTextDropdown}>
          <Dropdown
            text={colorStepText}
            variant="normal"
            options={colorStepsArr}
            onClick={(stepText: string) => {
              handleColorStepChange(stepText);
            }}
          />
        </div>
        <div className={styles.colorPickerContainer}>
          <div className={styles.colorPickers}>
            <ColorPicker
              background={headerTextColor}
              setColorStep={() => handleColorStepChange(colorStepsArr[0])}
              activeColorStep={activeColorStep}
              colorStep={0}
            />
            <ColorPicker
              background={subtitleTextColor}
              setColorStep={() => handleColorStepChange(colorStepsArr[1])}
              activeColorStep={activeColorStep}
              colorStep={1}
            />
            <ColorPicker
              background={primaryColor}
              setColorStep={() => handleColorStepChange(colorStepsArr[2])}
              activeColorStep={activeColorStep}
              colorStep={2}
            />
            <ColorPicker
              background={accentColor}
              setColorStep={() => handleColorStepChange(colorStepsArr[3])}
              activeColorStep={activeColorStep}
              colorStep={3}
            />
            <ColorPicker
              background={backgroundColor}
              setColorStep={() => handleColorStepChange(colorStepsArr[4])}
              activeColorStep={activeColorStep}
              colorStep={4}
            />
            <ColorPicker
              background={inboundMessageColor}
              setColorStep={() => handleColorStepChange(colorStepsArr[5])}
              activeColorStep={activeColorStep}
              colorStep={5}
            />
            <ColorPicker
              background={inboundMessageTextColor}
              setColorStep={() => handleColorStepChange(colorStepsArr[6])}
              activeColorStep={activeColorStep}
              colorStep={6}
            />
            <ColorPicker
              background={outboundMessageColor}
              setColorStep={() => handleColorStepChange(colorStepsArr[7])}
              activeColorStep={activeColorStep}
              colorStep={7}
            />
            <ColorPicker
              background={outboundMessageTextColor}
              setColorStep={() => handleColorStepChange(colorStepsArr[8])}
              activeColorStep={activeColorStep}
              colorStep={8}
            />
            <ColorPicker
              background={unreadMessageDotColor}
              setColorStep={() => handleColorStepChange(colorStepsArr[9])}
              activeColorStep={activeColorStep}
              colorStep={9}
            />
          </div>
        </div>
        {showHeaderTextColorPicker && (
          <ModalColorPicker
            color={headerTextColor}
            setColor={setHeaderTextColor}
            toggle={toggleShowHeaderTextColorPicker}
          />
        )}
        {showSubtitleTextColorPicker && (
          <ModalColorPicker
            color={subtitleTextColor}
            setColor={setSubtitleTextColor}
            toggle={toggleShowSubtitleTextColorPicker}
          />
        )}
        {showPrimaryColorPicker && (
          <ModalColorPicker color={primaryColor} setColor={setPrimaryColor} toggle={toggleShowPrimaryColorPicker} />
        )}
        {showAccentColorPicker && (
          <ModalColorPicker color={accentColor} setColor={setAccentColor} toggle={toggleShowAccentColorPicker} />
        )}
        {showBackgroundColorPicker && (
          <ModalColorPicker
            color={backgroundColor}
            setColor={setBackgroundColor}
            toggle={toggleShowBackgroundColorPicker}
          />
        )}
        {showInboundMessageColorPicker && (
          <ModalColorPicker
            color={inboundMessageColor}
            setColor={setInboundMessageColor}
            toggle={toggleShowInboundMessageColorPicker}
          />
        )}
        {showInboundMessageTextColorPicker && (
          <ModalColorPicker
            color={inboundMessageTextColor}
            setColor={setInboundMessageTextColor}
            toggle={toggleShowInboundMessageTextColorPicker}
          />
        )}
        {showOutboundMessageColorPicker && (
          <ModalColorPicker
            color={outboundMessageColor}
            setColor={setOutboundMessageColor}
            toggle={toggleShowOutboundMessageColorPicker}
          />
        )}
        {showOutboundMessageTextColorPicker && (
          <ModalColorPicker
            color={outboundMessageTextColor}
            setColor={setOutboundMessageTextColor}
            toggle={toggleShowOutboundMessageTextColorPicker}
          />
        )}
        {showUnreadMessageDotColorPicker && (
          <ModalColorPicker
            color={unreadMessageDotColor}
            setColor={setUnreadMessageDotColor}
            toggle={toggleShowUnreadMessageDotColorPicker}
          />
        )}
      </div>
      <div className={styles.inputsContainer}>
        <p className={styles.hexTitle}>Hex</p>
        {activeColorStep === 0 && (
          <SampleInput
            value={headerTextColor}
            setValue={setHeaderTextColor}
            name={t('headerTextColor')}
            placeholder={DefaultColors.headerTextColor}
          />
        )}
        {activeColorStep === 1 && (
          <SampleInput
            value={subtitleTextColor}
            setValue={setSubtitleTextColor}
            name={t('subtitleTextColor')}
            placeholder={DefaultColors.subtitleTextColor}
          />
        )}
        {activeColorStep === 2 && (
          <SampleInput
            value={primaryColor}
            setValue={setPrimaryColor}
            name={t('primaryColor')}
            placeholder={DefaultColors.primaryColor}
          />
        )}
        {activeColorStep === 3 && (
          <SampleInput
            value={accentColor}
            setValue={setAccentColor}
            name={t('accentColor')}
            placeholder={DefaultColors.accentColor}
          />
        )}
        {activeColorStep === 4 && (
          <SampleInput
            value={backgroundColor}
            setValue={setBackgroundColor}
            name={t('backgroundColor')}
            placeholder={DefaultColors.backgroundColor}
          />
        )}
        {activeColorStep === 5 && (
          <SampleInput
            value={inboundMessageColor}
            setValue={setInboundMessageColor}
            name={t('inboundMessageColor')}
            placeholder={DefaultColors.inboundMessageColor}
          />
        )}
        {activeColorStep === 6 && (
          <SampleInput
            value={inboundMessageTextColor}
            setValue={setInboundMessageTextColor}
            name={t('inboundMessageTextColor')}
            placeholder={DefaultColors.inboundMessageTextColor}
          />
        )}
        {activeColorStep === 7 && (
          <SampleInput
            value={outboundMessageColor}
            setValue={setOutboundMessageColor}
            name={t('outboundMessageBackgroundColor')}
            placeholder={DefaultColors.outboundMessageColor}
          />
        )}
        {activeColorStep === 8 && (
          <SampleInput
            value={outboundMessageTextColor}
            setValue={setOutboundMessageTextColor}
            name={t('outboundMessageTextColor')}
            placeholder={DefaultColors.outboundMessageTextColor}
          />
        )}
        {activeColorStep === 9 && (
          <SampleInput
            value={unreadMessageDotColor}
            setValue={setUnreadMessageDotColor}
            name={t('unreadMessageDotColor')}
            placeholder={DefaultColors.unreadMessageDotColor}
          />
        )}
      </div>
      <div className={styles.colorSample}>
        <p className={styles.sampleTitle}>{t('sample')}</p>
        {activeColorStep === 0 && (
          <ColorPickerSample value={headerTextColor} toggle={toggleShowHeaderTextColorPicker} />
        )}
        {activeColorStep === 1 && (
          <ColorPickerSample value={subtitleTextColor} toggle={toggleShowSubtitleTextColorPicker} />
        )}
        {activeColorStep === 2 && <ColorPickerSample value={primaryColor} toggle={toggleShowPrimaryColorPicker} />}
        {activeColorStep === 3 && <ColorPickerSample value={accentColor} toggle={toggleShowAccentColorPicker} />}
        {activeColorStep === 4 && (
          <ColorPickerSample value={backgroundColor} toggle={toggleShowBackgroundColorPicker} />
        )}
        {activeColorStep === 5 && (
          <ColorPickerSample value={inboundMessageColor} toggle={toggleShowInboundMessageColorPicker} />
        )}
        {activeColorStep === 6 && (
          <ColorPickerSample value={inboundMessageTextColor} toggle={toggleShowInboundMessageTextColorPicker} />
        )}
        {activeColorStep === 7 && (
          <ColorPickerSample value={outboundMessageColor} toggle={toggleShowOutboundMessageColorPicker} />
        )}
        {activeColorStep === 8 && (
          <ColorPickerSample value={outboundMessageTextColor} toggle={toggleShowOutboundMessageTextColorPicker} />
        )}
        {activeColorStep === 9 && (
          <ColorPickerSample value={unreadMessageDotColor} toggle={toggleShowUnreadMessageDotColorPicker} />
        )}
      </div>
    </div>
    // </div>
  );
};
