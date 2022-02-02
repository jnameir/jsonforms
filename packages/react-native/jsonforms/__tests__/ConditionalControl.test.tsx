import { ControlElement, ControlProps, JsonSchema } from "@jsonforms/core";
import { VerticalLayout } from "@jsonforms/core/src/models/uischema";
import { DispatchCell, JsonForms } from "@jsonforms/react";
import React from "react";
import { Picker } from "react-native";
import { TextField } from "react-native-material-textfield";
import { RadioButton } from "react-native-material-ui";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import renderer, { act } from "react-test-renderer";
import { wait } from "../../api/wait";
import { MultiEnumCell } from "../cells/MultiEnumCell";
import { TextCell } from "../cells/TextCell";
import { ConditionalControl } from "../controls/ConditionalControl";
import { RNCells, RNRenderers } from "../index";

const multiSelectPath = "#/properties/nutritionalStatus";
const multiSelectLabel = "Ernährungszustand";

const multiSelectSchema = {
    title: multiSelectLabel,
    type: "array",
    items: {
        type: "string",
        enum: ["gut", "Adipositas", "Kachexie", "Exsikkose"],
    },
};

const multiSelectUISchema: ControlElement = {
    type: "Control",
    label: multiSelectLabel,
    scope: multiSelectPath,
    options: {
        format: "conditional",
        type: "enum",
        content: {
            gut: ["gut"],
            "auffällig, weil...": ["Adipositas", "Kachexie", "Exsikkose"],
        },
        nonConditionalLabel: "gut",
    },
};

const multiAndSingleSelectPath = "#/properties/treatmentByNewPhysician";
const multiAndSingleSelectLabel =
    "Erfolgt die Behandlung durch den neuen Arzt?";

const multiAndSingleSelectSchema = {
    title: multiAndSingleSelectLabel,
    type: ["array", "string"],
    items: {
        type: "string",
        enum: [
            "kein Akutbedarf",
            "kein Termin verfügbar",
            "Behandlung durch neuen Arzt nicht gewünscht",
            "Sonstiges",
            "unregelmäßig",
            "regelmäßig",
        ],
    },
};

const multiAndSingleSelectUISchema: ControlElement = {
    type: "Control",
    label: multiAndSingleSelectLabel,
    scope: multiAndSingleSelectPath,
    options: {
        format: "conditional",
        type: "enum",
        singleSelectLabels: ["ja"],
        content: {
            ja: ["unregelmäßig", "regelmäßig"],
            nein: [
                "kein Akutbedarf",
                "kein Termin verfügbar",
                "Behandlung durch neuen Arzt nicht gewünscht",
                "Sonstiges",
            ],
        },
    },
};

const textFieldPath = "#/properties/otherAbnormalities";
const textFieldLabel = "Sonstige Auffälligkeiten?";

const textFieldSchema = {
    title: textFieldLabel,
    type: "string",
};

const textFieldUISchema: ControlElement = {
    type: "Control",
    label: textFieldLabel,
    scope: textFieldPath,
    options: {
        format: "conditional",
        type: "string",
        content: {
            ja: "Bitte ausfüllen",
            nein: "",
        },
        nonConditionalLabel: "nein",
    },
};

describe("JSONForms: ConditionalControl unit test", () => {
    const getProps = (
        conditionalSchema: "multiselect" | "textfield" | "multiAndSingleSelect",
    ): ControlProps => {
        let path;
        let schema;
        let uiSchema;
        let label;

        if (conditionalSchema === "multiselect") {
            path = multiSelectPath;
            schema = multiSelectSchema;
            uiSchema = multiSelectUISchema;
            label = multiSelectLabel;
        }

        if (conditionalSchema === "textfield") {
            path = textFieldPath;
            schema = textFieldSchema;
            uiSchema = textFieldUISchema;
            label = textFieldLabel;
        }

        if (conditionalSchema === "multiAndSingleSelect") {
            path = multiAndSingleSelectPath;
            schema = multiAndSingleSelectSchema;
            uiSchema = multiAndSingleSelectUISchema;
            label = multiAndSingleSelectLabel;
        }

        return {
            data: "",
            path,
            schema,
            uischema: uiSchema,
            visible: true,
            enabled: true,
            label,
            errors: "",
            id: path,
            handleChange: () => null,
            rootSchema: {},
        };
    };

    const renderControl = (properties: ControlProps) => {
        const root = renderer.create(<ConditionalControl {...properties} />);
        const instance = root.root;

        return { root, instance };
    };

    test("success snapshot neutral", () => {
        const props = getProps("multiselect");
        const { root } = renderControl(props);
        expect(root.toJSON()).toMatchSnapshot();
    });

    test("multiselect: successfully render JSONForms DispatchedCell when conditional option is selected", () => {
        const props = getProps("multiselect");
        const { instance } = renderControl(props);
        const radioButtons = instance.findAllByType(RadioButton);
        radioButtons[1].props.onSelect("auffällig, weil...");
        const dispatchedCells = instance.findAllByType(DispatchCell);
        expect(dispatchedCells.length).toEqual(1);
    });

    test("multiselect: successfully unmount JSONForms DispatchedCell when non-conditional option is selected", () => {
        const props = getProps("multiselect");
        const { instance } = renderControl(props);
        const radioButtons = instance.findAllByType(RadioButton);
        radioButtons[0].props.onSelect("gut");
        const dispatchedCells = instance.findAllByType(DispatchCell);
        expect(dispatchedCells.length).toEqual(0);
    });

    test("multiAndSingleselect: successfully render JSONForms DispatchedCell when conditional option is selected", () => {
        const props = getProps("multiAndSingleSelect");
        const { instance } = renderControl(props);
        const radioButtons = instance.findAllByType(RadioButton);
        radioButtons[1].props.onSelect("nein");
        const dispatchedCells = instance.findAllByType(DispatchCell);
        expect(dispatchedCells.length).toEqual(1);
    });

    test("multiAndSingleSelect: successfully render JSONForms DispatchedCell when conditional option is selected", () => {
        const props = getProps("multiAndSingleSelect");
        const { instance } = renderControl(props);
        const radioButtons = instance.findAllByType(RadioButton);
        radioButtons[0].props.onSelect("ja");
        const dispatchedCells = instance.findAllByType(DispatchCell);
        expect(dispatchedCells.length).toEqual(1);
    });

    test("textfield: successfully render JSONForms DispatchedCell when conditional option is selected", () => {
        const props = getProps("textfield");
        const { instance } = renderControl(props);
        const radioButtons = instance.findAllByType(RadioButton);
        radioButtons[0].props.onSelect("ja");
        const dispatchedCells = instance.findAllByType(DispatchCell);
        expect(dispatchedCells.length).toEqual(1);
    });

    test("textfield: successfully unmount JSONForms DispatchedCell when non-conditional option is selected", () => {
        const props = getProps("textfield");
        const { instance } = renderControl(props);
        const radioButtons = instance.findAllByType(RadioButton);
        radioButtons[1].props.onSelect("nein");
        const dispatchedCells = instance.findAllByType(DispatchCell);
        expect(dispatchedCells.length).toEqual(0);
    });
});

describe("JSONForms: ConditionalControl integration test", () => {
    const schema: JsonSchema = {
        type: "object",
        properties: {
            nutritionalStatus: multiSelectSchema,
            otherAbnormalities: textFieldSchema,
            treatmentByNewPhysician: multiAndSingleSelectSchema,
        },
        required: [
            "nutritionalStatus",
            "otherAbnormalities",
            "treatmentByNewPhysician",
        ],
    };

    const uiSchema: VerticalLayout = {
        type: "VerticalLayout",
        elements: [
            multiSelectUISchema,
            textFieldUISchema,
            multiAndSingleSelectUISchema,
        ],
    };

    const fakeHandlerChange = jest.fn();

    function renderControl(initialData = {}) {
        const JSONForms = class JSONForms extends React.Component {
            render() {
                return (
                    <JsonForms
                        schema={schema}
                        uischema={uiSchema}
                        data={initialData}
                        renderers={RNRenderers}
                        cells={RNCells}
                        onChange={fakeHandlerChange}
                    />
                );
            }
        };
        const root = renderer.create(<JSONForms />);
        const instance = root.root;

        return { root, instance };
    }

    test("multiselect: successfully render on condition and select items", async () => {
        const { instance } = renderControl();
        const radioButtons = instance.findAllByType(RadioButton);

        /** select the conditional option for the multiselect component to be rendered */
        act(() => radioButtons[1].props.onSelect("auffällig, weil..."));

        const valuesToSelect = ["Kachexie", "Exsikkose"];
        const selectables = instance.findAllByType(SectionedMultiSelect);
        act(() => selectables[0].props.onSelectedItemsChange(valuesToSelect));

        expect(selectables[0].props.selectedItems).toEqual(valuesToSelect);
        await act(() => wait(100));
    });

    test("multiselect: successfully show error if all items unselected", () => {
        const { instance } = renderControl();
        const radioButtons = instance.findAllByType(RadioButton);

        /** select the conditional option for the multiselect component to be rendered */
        act(() => radioButtons[1].props.onSelect("auffällig, weil..."));

        const valuesToSelect = [];
        const selectables = instance.findAllByType(SectionedMultiSelect);
        act(() => selectables[0].props.onSelectedItemsChange(valuesToSelect));

        const multiEnumCells = instance.findAllByType(MultiEnumCell);

        expect(multiEnumCells[0].props.errors).toEqual(
            "is a required property",
        );
    });

    test("multiselect: successfully delete data when conditional component is unmounted", () => {
        const { instance } = renderControl();
        const radioButtons = instance.findAllByType(RadioButton);

        /** select the conditional option for the multiselect component to be rendered */
        act(() => radioButtons[1].props.onSelect("auffällig, weil..."));

        const valuesToSelect = ["Kachexie", "Exsikkose"];
        const selectables = instance.findAllByType(SectionedMultiSelect);
        act(() => selectables[0].props.onSelectedItemsChange(valuesToSelect));

        /** unmount component by selecting the non-conditional top-level option */
        act(() => radioButtons[0].props.onSelect("gut"));

        const conditionalControls = instance.findAllByType(ConditionalControl);

        expect(conditionalControls[0].props.data).toEqual(["gut"]);
        expect(conditionalControls[0].props.data.length).toEqual(1);
    });

    test("multiAndSingleSelect: successfully render multiselect on condition and select items", async () => {
        const { instance } = renderControl();
        const radioButtons = instance.findAllByType(RadioButton);

        /** select the conditional option for the multiselect component to be rendered */
        act(() => radioButtons[5].props.onSelect("nein"));

        const valuesToSelect = [
            "kein Akutbedarf",
            "Behandlung durch neuen Arzt nicht gewünscht",
        ];

        const selectables = instance.findAllByType(SectionedMultiSelect);
        act(() => selectables[0].props.onSelectedItemsChange(valuesToSelect));

        expect(selectables[0].props.selectedItems).toEqual(valuesToSelect);
        await act(() => wait(100));
    });

    test("multiAndSingleSelect: successfully render singleSelect on condition and select item", async () => {
        const { instance } = renderControl();
        const radioButtons = instance.findAllByType(RadioButton);

        /** select the conditional option for the singleSelect component to be rendered */
        act(() => radioButtons[4].props.onSelect("ja"));

        const valueToSelect = "regelmäßig";
        const selectables = instance.findAllByType(Picker);

        act(() => selectables[0].props.onValueChange(valueToSelect));

        expect(selectables[0].props.selectedValue).toEqual(valueToSelect);
        await act(() => wait(100));
    });

    test("multiAndSingleSelect: successfully show error if item unselected (singleSelect)", () => {
        const { instance } = renderControl();
        const radioButtons = instance.findAllByType(RadioButton);

        /** select the conditional option for the singleSelect component to be rendered */
        act(() => radioButtons[4].props.onSelect("ja"));

        const conditionalControls = instance.findAllByType(ConditionalControl);

        expect(conditionalControls[2].props.errors).toEqual(
            "is a required property",
        );
    });

    test("multiAndSingleSelect: successfully show error if item unselected (multiSelect)", () => {
        const { instance } = renderControl();
        const radioButtons = instance.findAllByType(RadioButton);

        /** select the conditional option for the singleSelect component to be rendered */
        act(() => radioButtons[4].props.onSelect("nein"));

        const conditionalControls = instance.findAllByType(ConditionalControl);

        expect(conditionalControls[2].props.errors).toEqual(
            "is a required property",
        );
    });

    test("textfield: successfully render on condition and enter text", () => {
        const { instance } = renderControl();
        const radioButtons = instance.findAllByType(RadioButton);

        /** select the conditional option for the textfield component to be rendered */
        act(() => radioButtons[2].props.onSelect("ja"));

        const textToEnter = "entered text";
        const textFields = instance.findAllByType(TextField);
        act(() => textFields[0].props.onChangeText(textToEnter));

        expect(textFields[0].props.value).toEqual(textToEnter);
    });

    test("textfield: successfully show error if no options selected", () => {
        const { instance } = renderControl();
        const conditionalControls = instance.findAllByType(ConditionalControl);
        expect(conditionalControls[1].props.errors).toEqual(
            "is a required property",
        );
    });

    test("textfield: successfully show error if rendered on condition but no text entered", async () => {
        const { instance } = renderControl();
        const radioButtons = instance.findAllByType(RadioButton);

        /** select the conditional option for the textfield component to be rendered */
        act(() => radioButtons[2].props.onSelect("ja"));
        const textCells = instance.findAllByType(TextCell);

        expect(textCells[0].props.errors).toEqual("is a required property");
    });

    test("textfield: successfully delete data when conditional component is unmounted", () => {
        const { instance } = renderControl();
        const radioButtons = instance.findAllByType(RadioButton);

        /** select the conditional option for the textfield component to be rendered */
        act(() => radioButtons[2].props.onSelect("ja"));

        const textFields = instance.findAllByType(TextField);
        act(() => textFields[0].props.onChangeText("entered text"));

        /** unmount component by selecting the non-conditional top-level option */
        act(() => radioButtons[3].props.onSelect("nein"));

        const conditionalControls = instance.findAllByType(ConditionalControl);

        expect(conditionalControls[1].props.data).toEqual("");
    });

    test("successfully preload data", () => {
        const selectedValues = ["Kachexie", "Exsikkose"];
        const enteredText = "this is a test";

        const { instance } = renderControl({
            nutritionalStatus: selectedValues,
            otherAbnormalities: enteredText,
        });

        const selectables = instance.findAllByType(SectionedMultiSelect);
        expect(selectables[0].props.selectedItems).toEqual(selectedValues);

        const textFields = instance.findAllByType(TextField);
        expect(textFields[0].props.value).toEqual(enteredText);
    });

    test("successfully preload data multiAndSingleSelect - singleselect", () => {
        const selectedValue = "regelmäßig";

        const { instance } = renderControl({
            treatmentByNewPhysician: selectedValue,
        });

        const selectables = instance.findAllByType(Picker);

        expect(selectables[0].props.selectedValue).toEqual(selectedValue);

        /** The new top-level conditional option is dynamically assigned based on to the initial preloaded values */
        const radioButtons = instance.findAllByType(RadioButton);
        expect(radioButtons[4].props.checked).toEqual(true);
    });

    test("successfully preload data multiAndSingleSelect - multiselect", () => {
        const selectedValues = ["kein Termin verfügbar", "kein Akutbedarf"];

        const { instance } = renderControl({
            treatmentByNewPhysician: selectedValues,
        });

        const selectables = instance.findAllByType(SectionedMultiSelect);

        expect(selectables[0].props.selectedItems).toEqual(selectedValues);

        /** The new top-level conditional option is dynamically assigned based on to the initial preloaded values */
        const radioButtons = instance.findAllByType(RadioButton);
        expect(radioButtons[5].props.checked).toEqual(true);
    });

    test("successfully preload data and assign the correct top-level label if there are more than one conditionally rendered multiselect questions", () => {
        /** Add additional values to the schema so that it looks like:
         {
            "type": "string",
            "enum": ["Adipositas", "Kachexie", "Exsikkose", "additionalValue1", "additionalValue2", "additionalValue3"],
         }
         * */

        schema.properties.nutritionalStatus.items["enum"].push(
            "additionalValue1",
        );
        schema.properties.nutritionalStatus.items["enum"].push(
            "additionalValue2",
        );
        schema.properties.nutritionalStatus.items["enum"].push(
            "additionalValue3",
        );

        /** Assign the new values to a new conditional option in the UI schema:
         content: {
            gut: [],
            "auffällig, weil...": ["Adipositas", "Kachexie", "Exsikkose"],
            "additionalOption": ["additionalValue1", "additionalValue2", "additionalValue3"],
         }
         * */

        uiSchema.elements[0].options.content["additionalOption"] = [
            "additionalValue1",
            "additionalValue2",
            "additionalValue3",
        ];

        const selectedValues = ["additionalValue1", "additionalValue2"];

        const { instance } = renderControl({
            nutritionalStatus: selectedValues,
        });

        const selectables = instance.findAllByType(SectionedMultiSelect);
        expect(selectables[0].props.selectedItems).toEqual(selectedValues);

        /** The new top-level conditional option is dynamically assigned based on to the initial preloaded values */
        const radioButtons = instance.findAllByType(RadioButton);
        expect(radioButtons[2].props.checked).toEqual(true);
    });
});
