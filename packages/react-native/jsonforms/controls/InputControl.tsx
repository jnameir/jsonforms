import {
    computeLabel,
    ControlProps,
    ControlState,
    isControl,
    isDescriptionHidden,
    isPlainLabel,
    NOT_APPLICABLE,
    RankedTester,
    rankWith,
} from "@jsonforms/core";
import {
    Control,
    DispatchCell,
    withJsonFormsControlProps,
} from "@jsonforms/react";
import maxBy from "lodash/maxBy";
import merge from "lodash/merge";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../styles";
import { localizeErrors } from "../util";
import { ErrorText } from "../util/ErrorText";

export class InputControl extends Control<ControlProps, ControlState> {
    public render() {
        const {
            description,
            data,
            id,
            errors,
            label,
            uischema,
            schema,
            visible,
            required,
            path,
            cells,
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
        const labelText = isPlainLabel(label) ? label : label.default;
        const cell = maxBy(cells, (r) => r.tester(uischema, schema));
        if (
            cell === undefined ||
            cell.tester(uischema, schema) === NOT_APPLICABLE
        ) {
            console.warn("No applicable cell found.", uischema, schema);

            return null;
        }

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
                        labelText,
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
                <DispatchCell
                    uischema={uischema}
                    schema={schema}
                    path={path}
                    id={`${id}-input`}
                />
            </View>
        );
    }
}

export const inputControlTester: RankedTester = rankWith(1, isControl);

export default withJsonFormsControlProps(InputControl);

const styles = StyleSheet.create({
    standardContainer: { padding: 5 },
});
