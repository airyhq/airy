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
  const inputArr: React.ReactElement[] = [];

  useEffect(() => {
    props.setConfig(input);
  }, [input]);

  console.log(configurationValues);

  source !== Source.chatPlugin &&
    configurationValues &&
    Object.entries(configurationValues).forEach((item, index) => {
      let key = item[0];
      const keyTyped = key as keyof typeof input;
      const valueTyped = input[keyTyped] || '';
      const toolTip = key.charAt(0).toUpperCase() + key.slice(1);

      if (key.includes('URL')) {
        key = key.replace('URL', 'Url');
      }

      if (key.includes('API')) {
        key = key.replace('API', 'Api');
      }

      let replacedKey = key.replace(/([A-Z])/g, ' $1');

      if (replacedKey.includes('Url')) {
        replacedKey = replacedKey.replace('Url', 'URL');
      }

      if (replacedKey.includes('Api')) {
        replacedKey = replacedKey.replace('Api', 'API');
      }

      if (replacedKey.includes('ibm')) {
        replacedKey = replacedKey.replace('ibm', 'IBM');
      }

      const label = replacedKey.charAt(0).toUpperCase() + replacedKey.slice(1);
      const defaultPlaceholder = `${replacedKey.charAt(0).toUpperCase() + replacedKey.slice(1)}`;
      const capitalSource = source?.charAt(0).toUpperCase() + source?.slice(1).replace('.', '');
      const isUrl = label.includes('URL');
      const hasSteps = source === Source.dialogflow && replacedKey.includes('Level');
      const stepPlaceholder = `0.1 ${t('to')} 0.9`;
      const sensitive = label.includes('Token') || label.includes('Password') || label.includes('Secret');
      const placeholder = source === 'rasa' ? t(`rasaPlaceholder`) : hasSteps ? stepPlaceholder : defaultPlaceholder;

      inputArr.push(
        <div key={index} className={styles.input}>
          <Input
            type={sensitive ? 'password' : isUrl ? 'url' : hasSteps ? 'number' : 'text'}
            step={hasSteps ? 0.01 : undefined}
            min={hasSteps ? 0.1 : undefined}
            max={hasSteps ? 0.9 : undefined}
            name={key}
            value={valueTyped === 'string' || valueTyped === 'optionalString' ? '' : valueTyped}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput({...input, [keyTyped]: e.target.value})}
            label={label}
            placeholder={placeholder}
            showLabelIcon
            tooltipText={t(`inputTooltip${capitalSource}${toolTip}`)}
            required={valueTyped !== 'optionalString'}
            height={32}
            fontClass="font-base"
          />
        </div>
      );
    });

  return (
    <div className={styles.inputsContainer} style={inputArr.length > 4 ? {height: '42vh'} : {}}>
      {inputArr}
    </div>
  );
};
