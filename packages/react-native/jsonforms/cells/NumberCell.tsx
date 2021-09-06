import {
  CellProps,
  isNumberControl,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { withJsonFormsCellProps } from '@jsonforms/react';
import merge from 'lodash/merge';
import React from 'react';
import { TextField } from 'rn-material-ui-textfield';

export const NumberCell = (props: CellProps) => {
  const { config, data, enabled, uischema, schema, path, handleChange } = props;

  const onChange = (value: string) => {
    handleChange(path, value);
  };

  const { maxLength } = schema;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  return (
    <TextField
      value={data ?? ''}
      onChangeText={onChange}
      editable={enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      maxLength={appliedUiSchemaOptions.restrict ? maxLength : undefined}
    />
  );
};

/**
 * Default tester for number controls.
 * @type {RankedTester}
 */
export const numberCellTester: RankedTester = rankWith(2, isNumberControl);

export default withJsonFormsCellProps(NumberCell);
