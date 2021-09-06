import {
  CellProps,
  isStringControl,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { withJsonFormsCellProps } from '@jsonforms/react';
import merge from 'lodash/merge';
import React from 'react';
import { TextField } from 'rn-material-ui-textfield';

export const TextCell = (props: CellProps) => {
  const { config, data, enabled, uischema, schema, path, handleChange } = props;

  const onChange = (value: string) => {
    handleChange(path, value);
  };

  const { maxLength } = schema;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  return (
    <TextField
      value={data || ''}
      onChangeText={onChange}
      secureTextEntry={
        appliedUiSchemaOptions.format === 'password' ? true : false
      }
      editable={enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      maxLength={appliedUiSchemaOptions.restrict ? maxLength : undefined}
      label=''
    />
  );
};

/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textCellTester: RankedTester = rankWith(1, isStringControl);

export default withJsonFormsCellProps(TextCell);
