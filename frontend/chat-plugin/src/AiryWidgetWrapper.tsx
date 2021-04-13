import React from 'react';
import AiryWidget from './AiryWidget';
import {AiryWidgetConfiguration} from './config';



export function AiryWidgetWrapper({config}: AiryWidgetConfiguration) {

    const Wrapper = new AiryWidget(config);



}
