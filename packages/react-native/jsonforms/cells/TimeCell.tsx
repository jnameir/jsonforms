import {
  CellProps,
  isTimeControl,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { withJsonFormsCellProps } from '@jsonforms/react';
import React, { useState } from 'react';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { twoDigits } from '../util';
import { TextField } from 'rn-material-ui-textfield';
import { TouchableOpacity } from 'react-native';
import moment from 'moment';

export const TimeCell = (props: CellProps) => {
  const { data, path, handleChange } = props;

  const [show, setShow] = useState(false);

  const onToggle = () => {
    setShow(!show);
  };

  const currentDate = new Date();
  const currentTime = `${twoDigits(currentDate.getHours())}:${twoDigits(
    currentDate.getMinutes()
  )}`;

  const onChange = (event: Event, time: Date) => {
    if (time !== undefined) {
      handleChange(
        path,
        `${twoDigits(time.getHours())}:${twoDigits(time.getMinutes())}`
      );
    }
    setShow(!show);
  };

  return (
    <>
      {show && (
        <DateTimePicker
          onChange={onChange}
          value={moment(currentDate)
            .startOf(data || currentTime)
            .toDate()}
          mode='time'
          is24Hour={true}
          display='default'
        />
      )}
      <TouchableOpacity onPress={onToggle}>
        <TextField value={data || currentTime} disabled={true} />
      </TouchableOpacity>
    </>
  );
};

/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export const timeCellTester: RankedTester = rankWith(2, isTimeControl);

export default withJsonFormsCellProps(TimeCell);
