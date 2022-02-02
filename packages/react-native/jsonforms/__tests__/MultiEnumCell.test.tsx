import { render } from "@entyre/test-utilities";
import { EnumCellProps } from "@jsonforms/core";
import React from "react";
import { View } from "react-native";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { MultiEnumCell } from "../../jsonforms/cells/MultiEnumCell";

const props: Partial<EnumCellProps> = {
    data: "",
    path: "#/test",
    schema: {
        items: {
            type: "string",
            enum: ["option1", "option2", "option3"],
        },
    },
    visible: true,
    enabled: true,
};

function renderCell(properties: Partial<EnumCellProps>) {
    const root = render<typeof MultiEnumCell>(() => (
        <MultiEnumCell {...properties} />
    ));

    const { instance } = root;

    return {
        root,
        instance,
    };
}

describe("JSONForms: MultiEnumCell", () => {
    test("success snapshot neutral", () => {
        const handleChange = jest.fn();
        props.handleChange = handleChange;
        const { root } = renderCell(props);
        expect(root.json).toMatchSnapshot();
    });

    test("success select items", () => {
        const handleChange = jest.fn();
        props.handleChange = handleChange;
        const { instance } = renderCell(props);
        const selectedValues = ["option1", "option2"];
        const selectables = instance.findAllByType(SectionedMultiSelect);
        selectables[0].props.onSelectedItemsChange(selectedValues);
        expect(handleChange).toHaveBeenCalledWith(props.path, selectedValues);
    });

    test("success selected items", () => {
        const selectedValues = ["option1", "option2"];
        props.data = selectedValues;
        const { instance } = renderCell(props);
        const selectables = instance.findAllByType(SectionedMultiSelect);
        expect(selectables[0].props.selectedItems).toEqual(selectedValues);
    });

    test("success not visible", () => {
        props.visible = false;
        const { instance } = renderCell(props);
        const selectables = instance.findAllByType(View);
        expect(selectables[1].props.style).toEqual(undefined);
    });

    test("error rendering cell", () => {
        props.schema = {};
        const { instance } = renderCell(props);
        expect(instance).toEqual(undefined);
    });
});
