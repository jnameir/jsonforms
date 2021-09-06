import {
  CellProps,
  isBooleanControl,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { withJsonFormsCellProps } from '@jsonforms/react';
import React from 'react';
import { Checkbox } from 'react-native-material-ui';

export const BooleanCell = (props: CellProps) => {
  const { data, enabled, path, handleChange } = props;

  const onChange = () => {
    handleChange(path, !data);
  };

  return (
    <Checkbox
      label=''
      value={path}
      checked={!!data}
      onCheck={onChange}
      disabled={!enabled}
    />
  );
};

/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
export const booleanCellTester: RankedTester = rankWith(2, isBooleanControl);

export default withJsonFormsCellProps(BooleanCell);
