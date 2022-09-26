import {Input} from 'components';
import {Source} from 'model';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styles from './SetConfigInputs.module.scss';

type SetConfigInputsProps = {
  configurationValues: {[key: string]: string};
  setConfig: Dispatch<SetStateAction<{}>>;
  storedConfig: {};
  source: string;
};

export const SetConfigInputs = (props: SetConfigInputsProps) => {
  const {configurationValues, storedConfig, source} = props;
  const [input, setInput] = useState(storedConfig || configurationValues);
  const {t} = useTranslation();
  const inputArr: any = [];

  useEffect(() => {
    props.setConfig(input);
  }, [input]);

  source !== Source.chatPlugin &&
    Object.entries(configurationValues).forEach((item, index) => {
      const key = item[0];
      const keyTyped = key as keyof typeof input;
      const valueTyped = input[keyTyped] || '';
      const toolTip = key.charAt(0).toUpperCase() + key.slice(1);
      const replacedKey = key.replace(/([A-Z])/g, ' $1');
      const label = replacedKey.charAt(0).toUpperCase() + replacedKey.slice(1);
      const placeholder = `${replacedKey.charAt(0).toUpperCase() + replacedKey.slice(1)}`;
      const capitalSource = source?.charAt(0).toUpperCase() + source?.slice(1).replace('.', '');
      const isUrl = label.includes('Url');
      const hasSteps = source === Source.dialogflow && replacedKey.includes('Level');
      const stepPlaceholder = `0.1 ${t('to')} 0.9`;

      inputArr.push(
        <div key={index} className={styles.input}>
          <Input
            type={isUrl ? 'url' : hasSteps ? 'number' : 'text'}
            step={hasSteps && 0.01}
            min={hasSteps && 0.1}
            max={hasSteps && 0.9}
            name={key}
            value={valueTyped === 'string' || valueTyped === 'optionalString' ? '' : valueTyped}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput({...input, [keyTyped]: e.target.value})}
            label={label}
            placeholder={hasSteps ? stepPlaceholder : placeholder}
            showLabelIcon
            tooltipText={t(`inputTooltip${capitalSource}${toolTip}`)}
            required={valueTyped !== 'optionalString'}
            height={32}
            fontClass="font-base"
          />
        </div>
      );
    });

  return inputArr;
};
