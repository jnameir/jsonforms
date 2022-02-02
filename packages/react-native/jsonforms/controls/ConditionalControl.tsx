import {
    computeLabel,
    ControlProps,
    ControlState,
    isDescriptionHidden,
    isPlainLabel,
    optionIs,
    RankedTester,
    rankWith,
} from "@jsonforms/core";
import {
    Control,
    DispatchCell,
    withJsonFormsControlProps,
} from "@jsonforms/react";
import bind from "bind-decorator";
import merge from "lodash/merge";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-material-ui";
import { globalStyles } from "../styles";
import { localizeErrors } from "../util";
import { ErrorText } from "../util/ErrorText";

interface State {
    selectedOption: string;
}

/** this is defined as a class component in order to extend from the jsonforms package's Control class */
export class ConditionalControl extends Control<
    ControlProps,
    ControlState & State
> {
    @bind
    private onChange(value: string) {
        const { handleChange, path, uischema } = this.props;

        this.setState({ selectedOption: value || "" });

        const { nonConditionalLabel } = uischema.options;

        if (nonConditionalLabel === value) {
            /* if the label of the selected field is the nonConditionalLabel from the uiSchema and it's a multi-/singleselect,
            then assign the value of the label. Otherwise (if text field), assign the content (mostly "").
             */
            const defaultValue =
                uischema.options.type === "enum"
                    ? [value]
                    : uischema.options.content[value];
            handleChange(path, defaultValue);
        } else {
            handleChange(path, undefined);
        }
    }

    public componentDidMount() {
        const { data, uischema, schema } = this.props;
        const options = Object.keys(uischema.options.content);

        if (!data) {
            return;
        }

        /** If data are there to preload */
        switch (uischema.options?.type) {
            case "enum":
                for (const field of options) {
                    /** prefill nested multi select */
                    if (
                        schema.type === "array" ||
                        (uischema.options?.singleSelectLabels &&
                            !uischema.options?.singleSelectLabels.includes(
                                field,
                            ))
                    ) {
                        /** Assign the conditional top-level label value based on the values of the conditionally rendered component */
                        if (
                            data.every((item) =>
                                uischema.options.content[field].includes(item),
                            )
                        ) {
                            this.onChange(field);
                            break; /** finish search if the top-level key is matching the values defined in the UI schema */
                        }
                    }

                    /** prefill nested single select */
                    if (
                        schema.type === "string" ||
                        uischema.options?.singleSelectLabels?.includes(field)
                    ) {
                        if (uischema.options.content[field].includes(data)) {
                            this.onChange(field);
                            break;
                        }
                    }
                }

                break;
            case "string":
                for (const field of options) {
                    /** Assign the conditional top-level label value based on which conditional option should render text field */
                    if (uischema.options.content[field]) {
                        this.onChange(field);
                        break; /** finish search if the top-level key is found */
                    }
                }
        }
    }

    public render() {
        const {
            id,
            label,
            data,
            required,
            description,
            errors,
            schema,
            uischema,
            visible,
            config,
            path,
        } = this.props;
        const isValid = errors.length === 0;

        const { selectedOption, isFocused } = this.state;

        const appliedUiSchemaOptions = merge({}, config, uischema.options);
        const showDescription = !isDescriptionHidden(
            visible,
            description,
            isFocused,
            appliedUiSchemaOptions.showUnfocusedDescription,
        );

        const errors_de = !isValid ? localizeErrors(schema, data) : "";

        const options = Object.keys(uischema.options.content);

        let ConditionalComponent = <></>;

        if (selectedOption) {
            let conditionalSchema: typeof schema;
            const conditionalUiSchema: typeof uischema = {
                type: "Control",
                scope: path,
            };

            const conditionalOptions = uischema.options.content[selectedOption];
            const { singleSelectLabels } = uischema.options;

            switch (uischema.options?.type) {
                case "enum":
                    if (conditionalOptions?.length > 0 && schema.items) {
                        conditionalSchema = {
                            type: "array",
                            items: {
                                type: "string",
                                enum: conditionalOptions,
                            },
                        };
                    }

                    if (
                        !schema.items ||
                        singleSelectLabels?.includes(selectedOption)
                    ) {
                        conditionalSchema = {
                            type: "string",
                            enum: conditionalOptions,
                        };
                    }

                    break;
                case "string":
                    if (conditionalOptions) {
                        conditionalSchema = {
                            type: "string",
                        };
                    }
            }

            /** render the conditionally loaded JSONForms component */
            if (conditionalSchema) {
                ConditionalComponent = (
                    <DispatchCell
                        uischema={conditionalUiSchema}
                        schema={conditionalSchema}
                        path={path}
                        id={`${id}-input`}
                    />
                );
            }

            if (uischema.options.nonConditionalLabel === selectedOption) {
                ConditionalComponent = <></>;
            }
        }

        return (
            <View
                style={
                    isValid
                        ? {
                              ...styles.standardContainer,
                              display: visible ? "flex" : "none",
                          }
                        : {
                              display: visible ? "flex" : "none",
                          }
                }
            >
                <Text style={globalStyles.standardText}>
                    {computeLabel(
                        isPlainLabel(label) ? label : label.default,
                        required,
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
                            checked={selectedOption === optionValue}
                            onSelect={this.onChange}
                            style={{ container: styles.radioButtonContainer }}
                        />
                    ))}
                </View>
                <View>{ConditionalComponent}</View>
            </View>
        );
    }
}

export const conditionalControlTester: RankedTester = rankWith(
    20,
    optionIs("format", "conditional"),
);

export default withJsonFormsControlProps(ConditionalControl);

const styles = StyleSheet.create({
    errorText: { color: "red" },
    standardContainer: { padding: 5 },
    radioButtonContainer: { flex: 0, minWidth: 200 },
});
