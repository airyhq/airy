import React, {useState} from 'react';
import {Input} from '@airyhq/components';
import styles from './CustomiseSection.module.scss';

interface CustomiseSectionProps {}

export const CustomiseSection = ({}: CustomiseSectionProps) => {

  const [bubbleIconUrl, setBubbleIconUrl] = useState('');
  const [sendMessageIconUrl, setSendMessageIconUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [accentColor, setAccentColor] = useState('');

  return (
    <div>
      <Input
        type="url"
        name="bubbleIconUrl"
        value={bubbleIconUrl}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setBubbleIconUrl(e.target.value);
        }}
        label="Bubble Logo URL"
        placeholder="(optionaly) add an image url"
        height={32}
        fontClass="font-base"
      />
      <Input
        type="url"
        name="sendMessageIconUrl"
        value={sendMessageIconUrl}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSendMessageIconUrl(e.target.value);
        }}		
        label="Input Icon URL"
        placeholder="(optionaly) add an image url"
        height={32}
        fontClass="font-base"
      />
      <p>Primary Color</p>
      <div className={styles.colorPicker}>
        <div className={styles.colorPickerSample} style={{backgroundColor: primaryColor}} />
        <Input
          type="text"
          name="Primary Color"
          value={primaryColor}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPrimaryColor(e.target.value);
          }}
          placeholder="#FFFFFF"
          height={32}
          fontClass="font-base"
        />
      </div>
      <p>Accent Color</p>
      <div className={styles.colorPicker}>
        <div className={styles.colorPickerSample} style={{backgroundColor: accentColor}} />
        <Input
          type="text"
          name="accentColor"
          value={accentColor}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setAccentColor(e.target.value);
          }}
					onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
						console.log(e.target.value);
					}}
          placeholder="#FFFFFF"
          height={32}
          fontClass="font-base"
        />
      </div>
    </div>
  );
};
