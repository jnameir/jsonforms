import {
    CellProps,
    isDateControl,
    RankedTester,
    rankWith,
} from "@jsonforms/core";
import { withJsonFormsCellProps } from "@jsonforms/react";
import React from "react";
import { DatePickerAndroid } from "react-native";
import { TextField } from "react-native-material-textfield";
import { Button } from "react-native-material-ui";
import { twoDigits } from "../util";

export const DateCell = (props: CellProps) => {
    const { data, path, handleChange } = props;
    const formattedDate = data
        ? `${data.split("-")[2]}.${data.split("-")[1]}.${data.split("-")[0]}`
        : "";

    const onChange = async () => {
        try {
            const date = await DatePickerAndroid.open({});

            if (date.action !== DatePickerAndroid.dismissedAction) {
                handleChange(
                    path,
                    `${date.year}-${twoDigits(date.month + 1)}-${twoDigits(
                        date.day,
                    )}`,
                );
            }
        } catch ({ code, message }) {
            console.log("wrong date format");
        }
    };

    return (
        <>
            <TextField value={formattedDate} editable={false} />
            <Button onPress={onChange} text="Pick date" />
        </>
    );
};

/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export const dateCellTester: RankedTester = rankWith(2, isDateControl);

export default withJsonFormsCellProps(DateCell);
