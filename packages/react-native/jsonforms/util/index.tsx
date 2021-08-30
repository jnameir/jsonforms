import Ajv from "ajv";
// Ajv option allErrors is required
import ajvErrors from "ajv-errors";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-material-ui";
import { globalStyles } from "../styles";

const ajv = new Ajv({ allErrors: true });

ajvErrors(ajv, {});

export const twoDigits = (value: number) => {
    return `0${value}`.substr(-2);
};

export const localizeErrors = (schema, data) => {
    if (!data) {
        return "*";
    }

    schema.errorMessage = {
        type: "(Wert ist ung�ltig)",
        required: "*",
    };

    const validate = ajv.compile(schema);
    validate(data);

    return validate.errors[1]
        ? validate.errors[1].message
        : validate.errors[0].message;
};

export const renderSubmitButton = (submitFunction: () => void) => {
    return (
        <View style={styles.submitButtonContainer}>
            <Button
                style={{
                    container: globalStyles.buttonSubmit,
                    text: globalStyles.buttonText,
                }}
                text="Abschließen"
                onPress={submitFunction}
            />
        </View>
    );
};

export const renderButton = (onPressFunction, color, fontColor, text) => (
    <View
        style={{
            ...styles.buttonContainer,
        }}
    >
        <Button
            style={{
                container: {
                    ...globalStyles.buttonStandard,
                    backgroundColor: color,
                },
                text: { color: fontColor },
            }}
            text={text}
            onPress={onPressFunction}
        />
    </View>
);

const styles = StyleSheet.create({
    submitButtonContainer: {
        width: "90%",
        alignSelf: "flex-end",
        padding: 10,
        height: 100,
    },
    buttonContainer: {
        width: "50%",
        marginTop: 10,
    },
});
