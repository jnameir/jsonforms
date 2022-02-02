import { Categorization } from "@jsonforms/core";
import React from "react";
import StepIndicator from "react-native-step-indicator";
import { stepperStyles } from "../../styles";

export interface CategorizationProps {
    categorization: Categorization;
    selectedPage: number;
    onSelect: any;
}

export const CategorizationList = ({
    categorization,
    selectedPage,
    onSelect,
}: CategorizationProps) => {
    const labels = categorization.elements.map((elem) => elem.label);

    return (
        <>
            <StepIndicator
                customStyles={stepperStyles}
                currentPosition={selectedPage}
                stepCount={labels.length}
                onPress={onSelect}
                direction="horizontal"
            />
        </>
    );
};
