import {
  CellProps,
  isDateTimeControl,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { withJsonFormsCellProps } from '@jsonforms/react';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { TextField } from 'rn-material-ui-textfield';
import { Button } from 'react-native-material-ui';

export const DateTimeCell = (props: CellProps) => {
  const { data, handleChange, path } = props;

  const [date, setDate] = useState(data ? new Date(data) : new Date());
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  const onChange = (event, selectedDate) => {
    setVisible(false);
    const currentDate = selectedDate || date;
    handleChange(path, currentDate.toISOString());
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setVisible(true);
    setMode('date');
  };

  const showTimepicker = () => {
    setVisible(true);
    setMode('time');
  };

  return (
    <>
      {visible && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display='default'
          onChange={onChange}
        />
      )}
      <TextField value={date.toLocaleString()} />
      <Button onPress={showDatepicker} text='Pick date' />
      <Button onPress={showTimepicker} text='Pick time' />
    </>
  );
};

/**
 * Default tester for datetime controls.
 * @type {RankedTester}
 */
export const dateTimeCellTester: RankedTester = rankWith(2, isDateTimeControl);

export default withJsonFormsCellProps(DateTimeCell);
