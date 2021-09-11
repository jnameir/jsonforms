import {
  CellProps,
  isIntegerControl,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { withJsonFormsCellProps } from '@jsonforms/react';
import merge from 'lodash/merge';
import React from 'react';
import { TextField } from 'rn-material-ui-textfield';
import { isEmpty } from 'lodash';

export const IntegerCell = (props: CellProps) => {
  const { config, data, enabled, uischema, schema, path, handleChange } = props;

  const onChange = (value: string) => {
    const numberValue = Number(value);

    if (isNaN(numberValue)) {
      return;
    }

    handleChange(path, isEmpty(value) ? '' : Number(value));
  };

  const { maxLength } = schema;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  return (
    <TextField
      value={isEmpty(data?.toString()) ? '' : data.toString()}
      onChangeText={onChange}
      editable={enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      maxLength={appliedUiSchemaOptions.restrict ? maxLength : undefined}
    />
  );
};

/**
 * Default tester for integer controls.
 * @type {RankedTester}
 */
export const integerCellTester: RankedTester = rankWith(2, isIntegerControl);

export default withJsonFormsCellProps(IntegerCell);
