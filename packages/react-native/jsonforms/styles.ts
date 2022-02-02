import { StyleSheet } from "react-native";

export const Colors = {
    PRIMARY_DISABLED: "grey",
    PRIMARY: "blue",
}

export const globalStyles = StyleSheet.create({
    standardText: { fontSize: 16 },
    buttonSubmit: {
        width: "50%",
        backgroundColor: Colors.PRIMARY,
        alignSelf: "flex-end",
    },
    buttonText: {
        color: "white",
    },
    buttonStandard: {
        flex: 0.5,
    },
});

export const stepperStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: "#25683e",
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: "#25683e",
    stepStrokeUnFinishedColor: "#aaaaaa",
    separatorFinishedColor: "#25683e",
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: "#25683e",
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: "black",
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelColor: "darkgrey",
    labelSize: 14,
    currentStepLabelColor: "black",
};
