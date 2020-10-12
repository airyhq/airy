import React, {useState} from 'react';
import 'react-dates/initialize';
import {DateRangePicker} from 'react-dates';
import moment from 'moment';

import 'react-dates/lib/css/_datepicker.css';
// Sadly this needs to be imported without changing the classnames. That is
// the only way to override the default look of this component.
import './react-date-override.scss';

export const DateRange = ({
  startDate,
  endDate,
  onDatesChange,
  minDate,
  maxDate,
  variant,
  anchorDirection,
  openDirection,
}: DateRangeProps) => {
  const [focusedInput, setFocusedInput] = useState(null);
  return (
    <div className={`DateRangeWrapper--${variant}`}>
      <DateRangePicker
        startDate={startDate}
        startDateId="your_unique_start_date_id"
        endDate={endDate}
        endDateId="your_unique_end_date_id"
        onDatesChange={onDatesChange}
        focusedInput={focusedInput}
        onFocusChange={focusedInput => setFocusedInput(focusedInput)}
        isOutsideRange={day => {
          return !moment(day).isBetween(minDate, maxDate, null, '[]');
        }}
        minDate={minDate}
        maxDate={maxDate}
        minimumNights={0}
        anchorDirection={anchorDirection}
        openDirection={openDirection}
      />
    </div>
  );
};

DateRange.defaultProps = {
  variant: 'default',
};

export interface DateRangeProps {
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  onDatesChange: (arg: {startDate: moment.Moment; endDate: moment.Moment}) => void;
  minDate: moment.Moment;
  maxDate: moment.Moment;
  openDirection?: 'up' | 'down';
  anchorDirection?: 'left' | 'right';
  variant?: 'light' | 'default';
}
