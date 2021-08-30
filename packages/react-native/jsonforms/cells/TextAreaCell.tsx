import {
    CellProps,
    isMultiLineControl,
    RankedTester,
    rankWith,
} from "@jsonforms/core";
import { withJsonFormsCellProps } from "@jsonforms/react";
import React from "react";
import { TextField } from "react-native-material-textfield";

export const TextAreaCell = (props: CellProps) => {
    const { data, enabled, uischema, path, handleChange } = props;

    const onChange = (value: string) => {
        handleChange(path, value);
    };

    return (
        <TextField
            value={data || ""}
            onChangeText={onChange}
            editable={enabled}
            autoFocus={uischema.options && uischema.options.focus}
            multiline={true}
        />
    );
};

/**
 * Tester for a multi-line string control.
 * @type {RankedTester}
 */
export const textAreaCellTester: RankedTester = rankWith(2, isMultiLineControl);

export default withJsonFormsCellProps(TextAreaCell);
