import {
  CellProps,
  isDateControl,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { withJsonFormsCellProps } from '@jsonforms/react';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { twoDigits } from '../util';
import { TextField } from 'rn-material-ui-textfield';
import { TouchableOpacity } from 'react-native';
import moment from 'moment';

export const DateCell = (props: CellProps) => {
  const { data, path, handleChange } = props;

  const formattedDate = data
    ? `${data.split('-')[2]}.${data.split('-')[1]}.${data.split('-')[0]}`
    : '';

  const [show, setShow] = useState(false);

  const onToggle = () => {
    setShow(!show);
  };

  const onChange = (event, date) => {
    if (date !== undefined) {
      handleChange(
        path,
        `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(
          date.getDate()
        )}`
      );
    }
    setShow(!show);
  };

  return (
    <>
      {show && (
        <DateTimePicker
          onChange={onChange}
          value={moment(formattedDate || new Date(), 'DD.MM.YYYY').toDate()}
          mode='date'
          is24Hour={true}
          display='default'
        />
      )}
      <TouchableOpacity onPress={onToggle}>
        <TextField value={formattedDate} disabled={true} />
      </TouchableOpacity>
    </>
  );
};

/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export const dateCellTester: RankedTester = rankWith(2, isDateControl);

export default withJsonFormsCellProps(DateCell);
