import {
    and,
    computeLabel,
    ControlProps,
    ControlState,
    isDescriptionHidden,
    isEnumControl,
    isPlainLabel,
    optionIs,
    RankedTester,
    rankWith,
} from "@jsonforms/core";
import { Control, withJsonFormsControlProps } from "@jsonforms/react";
import bind from "bind-decorator";
import merge from "lodash/merge";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-material-ui";
import { globalStyles } from "../styles";
import { localizeErrors } from "../util";
import { ErrorText } from "../util/ErrorText";

/** this is defined as a class component in order to extend from the jsonforms package's Control class */
export class RadioGroupControl extends Control<ControlProps, ControlState> {
    @bind
    private onChange(value) {
        this.props.handleChange(this.props.path, value);
    }

    public render() {
        const {
            label,
            data,
            required,
            description,
            errors,
            schema,
            uischema,
            visible,
            config,
        } = this.props;
        const isValid = errors.length === 0;

        const appliedUiSchemaOptions = merge({}, config, uischema.options);
        const showDescription = !isDescriptionHidden(
            visible,
            description,
            this.state.isFocused,
            appliedUiSchemaOptions.showUnfocusedDescription,
        );

        const options = schema.enum;
        const errors_de = !isValid ? localizeErrors(schema, data) : "";

        return (
            <View
                style={
                    isValid
                        ? {
                              ...styles.standardContainer,
                              display: visible ? "flex" : "none",
                          }
                        : {
                              // ...styles.errorContainer,
                              display: visible ? "flex" : "none",
                          }
                }
            >
                <Text style={globalStyles.standardText}>
                    {computeLabel(
                        isPlainLabel(label) ? label : label.default,
                        required,
                        // appliedUiSchemaOptions.hideRequiredAsterisk,
                        true,
                    )}
                    {!isValid ? (
                        <ErrorText errors={errors_de} />
                    ) : showDescription ? (
                        description
                    ) : null}
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                    }}
                >
                    {options.map((optionValue) => (
                        <RadioButton
                            key={optionValue}
                            label={optionValue}
                            value={optionValue}
                            checked={data == optionValue}
                            onSelect={this.onChange}
                            style={{ container: styles.radioButtonContainer }}
                        />
                    ))}
                </View>
            </View>
        );
    }
}

export const radioGroupControlTester: RankedTester = rankWith(
    20,
    and(isEnumControl, optionIs("format", "radio")),
);

export default withJsonFormsControlProps(RadioGroupControl);

const styles = StyleSheet.create({
    errorText: { color: "red" },
    standardContainer: { padding: 5 },
    // errorContainer: { backgroundColor: "seashell", padding: 5 },
    radioButtonContainer: { flex: 0, minWidth: 200 },
});
