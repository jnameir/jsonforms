import {
  CellProps,
  isTimeControl,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { withJsonFormsCellProps } from '@jsonforms/react';
import React from 'react';
import { TimePickerAndroid } from 'react-native';
import { TextField } from 'rn-material-ui-textfield';
import { Button } from 'react-native-material-ui';
import { twoDigits } from '../util';

export const TimeCell = (props: CellProps) => {
  const { data, path, handleChange } = props;

  const onChange = async () => {
    try {
      const time = await TimePickerAndroid.open({
        is24Hour: true
      });

      if (time.action !== TimePickerAndroid.dismissedAction) {
        handleChange(path, `${twoDigits(time.hour)}:${twoDigits(time.minute)}`);
      }
    } catch ({ code, message }) {
      console.log('wrong time format');
    }
  };

  return (
    <>
      <TextField value={data} editable={false} />
      <Button onPress={onChange} text='Pick time' />
    </>
  );
};

/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export const timeCellTester: RankedTester = rankWith(2, isTimeControl);

export default withJsonFormsCellProps(TimeCell);
