import {
    EnumCellProps,
    isEnumControl,
    RankedTester,
    rankWith
} from "@jsonforms/core";
import { withJsonFormsEnumCellProps } from "@jsonforms/react";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, View } from "react-native";

export const EnumCell = (props: EnumCellProps) => {
    const { data, enabled, path, handleChange, options, visible } = props;


    const onChange = (value) => {
        handleChange(path, value);
    };

    const showBorder = visible ? { style: styles.contentBorder } : null;

    return (
        <View style={styles.container}>
            <View {...showBorder}>
                <Picker
                    enabled={enabled}
                    selectedValue={data || ""}
                    onValueChange={onChange}
                >
                    {[
                        <Picker.Item
                            label="Bitte auswählen"
                            value=""
                            key="empty"
                        />,
                    ].concat(
                        options.map((optionValue) => (
                            <Picker.Item
                                value={optionValue.value}
                                label={optionValue.label}
                                key={optionValue.value}
                            />
                        )),
                    )}
                </Picker>
            </View>
        </View>
    );
};

/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
export const enumCellTester: RankedTester = rankWith(2, isEnumControl);

export default withJsonFormsEnumCellProps(EnumCell);

const styles = StyleSheet.create({
    container: {
        width: "30%",
        margin: 5,
    },
    contentBorder: {
        borderWidth: 1,
        borderColor: "darkgrey",
    },
});
