import { Input } from 'components';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';

enum ToggleColorPickerOptions {
  header = 'toggleShowHeaderTextColorPicker',
  subtitle = 'toggleShowSubtitleTextColorPicker',
}

enum ColorPickerColors {
    blue = '#57B2FC',
    red = '#E31E26',
    green = '#0BD561',
    purple = '#7360F2',
    yellow = '#FBBD54',
    white = '#FFFFFF',
    black = '#000000',
  }

type ColorPickerType = {
  background?: string;
  step?: number;
  setColorStepText?: (text: string) => void;
  setToggleColorPicker?: (active: boolean) => void;
};

export const ColorPicker = (props: ColorPickerType) => {
  const {background, setColorStepText} = props;
  const {t} = useTranslation();
  const [activeColorStep, setActiveColorStep] = useState(0);
  const [currentColorStepText, setCurrentColorStepText] = useState(`${t('headTextColor')}`);
  const [currentColor, setCurrentColor] = useState(localStorage);
  const [currentStep, setCurrentStep] = useState(0);
  const [colorPickerOption, setColorPickerOption] = useState(ToggleColorPickerOptions.header);

  console.log('ACTIVECOLORSTEP: ', activeColorStep);

  const handleColorStepChange = (step: number) => {
    switch (step) {
      case 0:
        setActiveColorStep(0);
        setCurrentStep(0);
        () => setColorStepText(`${t('headTextColor')}`);
        setCurrentColorStepText(`${t('headTextColor')}`);
        break;
      case 1:
        setActiveColorStep(1);
        setCurrentStep(1);
        () => setColorStepText(`${t('subtitleTextColor')}`);
        setCurrentColorStepText(`${t('subtitleTextColor')}`);
        break;
      case 2:
        setActiveColorStep(2);
        () => setColorStepText(`${t('primaryColor')}`);
        setCurrentColorStepText(`${t('primaryColor')}`);
        break;
      case 3:
        setActiveColorStep(3);
        setColorStepText(`${t('accentColor')}`);
        setCurrentColorStepText(`${t('accentColor')}`);
        break;
      case 4:
        setActiveColorStep(4);
        setColorStepText(`${t('backgroundColor')}`);
        setCurrentColorStepText(`${t('backgroundColor')}`);
        break;
      case 5:
        setActiveColorStep(5);
        setColorStepText(`${t('inboundBackgroundColor')}`);
        setCurrentColorStepText(`${t('inboundBackgroundColor')}`);
        break;
      case 6:
        setActiveColorStep(6);
        setColorStepText(`${t('outboundBackgroundColor')}`);
        setCurrentColorStepText(`${t('outboundBackgroundColor')}`);
        break;
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <p>{currentColorStepText}</p>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div className={styles.headerTextColors}>
          <div
            className={styles.inactiveColorStep}
            onClick={() => handleColorStepChange(0)}
            style={{background: currentColorStepText}}>
            {currentStep === 0 && (
              <>
                <div className={styles.activeColorStep} />
                <div style={{position: 'absolute', left: '760px', top: '410px'}}>
                  <div
                    className={styles.colorPickerSample}
                    style={{backgroundColor: 'currentColor'}}
                    onClick={() => ToggleColorPickerOptions.header}
                  />
                </div>
              </>
            )}
          </div>
          <div
            className={styles.inactiveColorStep}
            onClick={() => handleColorStepChange(1)}
            style={{background: currentColorStepText}}>
            {currentStep === 1 && (
              <>
                <div className={styles.activeColorStep} />
                <div style={{position: 'absolute', left: '760px', top: '410px'}}>
                  <div
                    className={styles.colorPickerSample}
                    style={{backgroundColor: currentColorStepText}}
                    onClick={() => ToggleColorPickerOptions.subtitle}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
            <p>Hex</p>
            <Input
              type="text"
              name={t('headerTextColor')}
              value={currentColorStepText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                // setHeaderTextColor(e.target.value);
              }}
              onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                if (value !== '') {
                  const newHeaderTextColor = value.startsWith('#') ? value : '#' + value;
                //   setHeaderTextColor(newHeaderTextColor.toUpperCase());
                } else {
                //   setHeaderTextColor('');
                }
              }}
              placeholder="#FFFFFF"
              height={32}
              fontClass="font-base"
            />
          </div>
      {/* <div
              className={styles.inactiveColorStep}
              onClick={() => handleColorStepChange(2)}
              style={{background: primaryColor}}>
              {activeColorStep === 2 && (
                <>
                  <div className={styles.activeColorStep} />
                  <div style={{position: 'absolute', left: '760px', top: '410px'}}>
                    <div
                      className={styles.colorPickerSample}
                      style={{backgroundColor: primaryColor}}
                      onClick={toggleShowPrimaryColorPicker}
                    />
                  </div>
                </>
              )}
            </div>
            <div
              className={styles.inactiveColorStep}
              onClick={() => handleColorStepChange(3)}
              style={{background: accentColor}}>
              {activeColorStep === 3 && (
                <>
                  <div className={styles.activeColorStep} />
                  <div style={{position: 'absolute', left: '760px', top: '410px'}}>
                    <div
                      className={styles.colorPickerSample}
                      style={{backgroundColor: accentColor}}
                      onClick={toggleShowAccentColorPicker}
                    />
                  </div>
                </>
              )}
            </div>
            <div
              className={styles.inactiveColorStep}
              onClick={() => handleColorStepChange(4)}
              style={{background: backgroundColor}}>
              {activeColorStep === 4 && (
                <>
                  <div className={styles.activeColorStep} />
                  <div style={{position: 'absolute', left: '760px', top: '410px'}}>
                    <div
                      className={styles.colorPickerSample}
                      style={{backgroundColor: backgroundColor}}
                      onClick={toggleShowBackgroundColorPicker}
                    />
                  </div>
                </>
              )}
            </div>
            <div
              className={styles.inactiveColorStep}
              onClick={() => handleColorStepChange(5)}
              style={{background: inboundMessageBackgroundColor}}>
              {activeColorStep === 5 && (
                <>
                  <div className={styles.activeColorStep} />
                  <div style={{position: 'absolute', left: '760px', top: '410px'}}>
                    <div
                      className={styles.colorPickerSample}
                      style={{backgroundColor: inboundMessageBackgroundColor}}
                      onClick={toggleShowInboundMessageColorPicker}
                    />
                  </div>
                </>
              )}
            </div>
            <div
              className={styles.inactiveColorStep}
              onClick={() => handleColorStepChange(6)}
              style={{background: outboundMessageBackgroundColor}}>
              {activeColorStep === 6 && (
                <>
                  <div className={styles.activeColorStep} />
                  <div style={{position: 'absolute', left: '760px', top: '410px'}}>
                    <div
                      className={styles.colorPickerSample}
                      style={{backgroundColor: outboundMessageBackgroundColor}}
                      onClick={toggleShowOutboundMessageColorPicker}
                    />
                  </div>
                </>
              )}
            </div> */}
    </div>
  );
};
