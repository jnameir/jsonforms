import {
  CellProps,
  isNumberControl,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { withJsonFormsCellProps } from '@jsonforms/react';
import merge from 'lodash/merge';
import React, { useState } from 'react';
import { TextField } from 'rn-material-ui-textfield';
import { isEmpty } from 'lodash';

export const NumberCell = (props: CellProps) => {
  const { config, data, enabled, uischema, schema, path, handleChange } = props;

  const [number, setNumber] = useState<string>(data?.toString());

  const onChange = (value: string) => {
    setNumber(value);

    const numberValue = Number(value);

    if (isNaN(numberValue)) {
      return;
    }

    handleChange(path, isEmpty(value) ? '' : numberValue);
  };

  const { maxLength } = schema;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  return (
    <TextField
      value={number?.toString() ?? ''}
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
