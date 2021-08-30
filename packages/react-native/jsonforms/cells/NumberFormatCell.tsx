import {
    CellProps,
    Formatted,
    isNumberFormatControl,
    RankedTester,
    rankWith,
} from "@jsonforms/core";
import { withJsonFormsCellProps } from "@jsonforms/react";
import React from "react";
import { TextField } from "react-native-material-textfield";

export const NumberFormatCell = (props: CellProps & Formatted<number>) => {
    const {
        enabled,
        uischema,
        path,
        handleChange,
        schema,
        toFormatted,
        fromFormatted,
    } = props;

    const { maxLength } = schema;
    const formattedNumber: string = toFormatted(props.data);

    const onChange = (value: string) => {
        const validStringNumber = fromFormatted(value);
        handleChange(path, validStringNumber);
    };

    return (
        <TextField
            value={formattedNumber}
            onChangeText={onChange}
            editable={enabled}
            autoFocus={uischema.options && uischema.options.focus}
            maxLength={
                uischema.options && uischema.options.restrict
                    ? maxLength
                    : undefined
            }
        />
    );
};

/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const numberFormatCellTester: RankedTester = rankWith(
    4,
    isNumberFormatControl,
);

/** workaround for 'withJsonFormsCellProps' which does not accept Components with more types than 'CellProps' */
const dummyHOC = (Component) => (props) => {
    return <Component {...props} />;
};

export default withJsonFormsCellProps(dummyHOC(NumberFormatCell));
