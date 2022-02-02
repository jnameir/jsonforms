import {
    and,
    EnumCellProps,
    enumToEnumOptionMapper,
    RankedTester,
    rankWith,
    schemaMatches,
    schemaTypeIs,
    uiTypeIs
} from "@jsonforms/core";
import { withJsonFormsEnumCellProps } from "@jsonforms/react";
import React from "react";
import { StyleSheet, View } from "react-native";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import Icons from "react-native-vector-icons/MaterialIcons";


export const MultiEnumCell = (props: Partial<EnumCellProps>) => {
    const { data, path, schema, handleChange, visible, enabled, errors } =
        props;

    const onChange = (value) => {
        handleChange(path, value?.length > 0 ? value : undefined);
    };

    let items = [];

    if (schema.items && "enum" in schema.items) {
        items = schema.items.enum;
    } else {
        return <></>;
    }

    const options = items.map((e) => enumToEnumOptionMapper(e));
    const preparedOptions = [{ id: 0, name: schema.title, children: [] }];

    options.forEach((e) =>
        preparedOptions[0].children.push({
            id: e.value,
            name: e.label,
        }),
    );

    const showBorder = visible
        ? errors
            ? { style: { ...styles.errorStyle } }
            : { style: { ...styles.contentBorder } }
        : null;

    /** workaround for fixing the wrong type definition of the 3rd party package react-native-sectioned-multi-select */
    const Icon = Icons as unknown as JSX.Element;

    return (
        <View style={styles.container}>
            <View {...showBorder} data-testid="MultiEnumCell-container">
                <SectionedMultiSelect
                    icons={multiSelectStyles.icons}
                    IconRenderer={Icon}
                    uniqueKey="id"
                    subKey="children"
                    items={preparedOptions}
                    selectText="Bitte auswählen..."
                    showDropDowns={false}
                    readOnlyHeadings={true}
                    hideSearch={false}
                    searchPlaceholderText="Suche"
                    confirmText="Übernehmen"
                    selectedText="ausgewählt"
                    selectedItems={data || []}
                    onSelectedItemsChange={onChange}
                    disabled={!enabled}
                    styles={multiSelectStyles.styles}
                />
            </View>
        </View>
    );
};
/**
 * Default tester for multi select enum controls.
 * @type {RankedTester}
 */

const isMultiEnumControl = and(
    uiTypeIs("Control"),
    schemaTypeIs("array"),
    schemaMatches(
        (schema) =>
            Object.prototype.hasOwnProperty.call(schema, "items") &&
            Object.prototype.hasOwnProperty.call(schema.items, "enum"),
    ),
);

export const multiEnumCellTester: RankedTester = rankWith(
    2,
    isMultiEnumControl,
);

export default withJsonFormsEnumCellProps(MultiEnumCell);

const styles = StyleSheet.create({
    container: {
        width: "50%",
        margin: 5,
    },
    contentBorder: {
        borderWidth: 1,
        borderColor: "darkgrey",
    },
    errorStyle: {
        borderWidth: 1,
        borderColor: "red",
    },
});

const multiSelectStyles = {
    icons: {
        search: {
            name: "search", // search input
            size: 24,
        },
        arrowUp: {
            name: "keyboard-arrow-up", // dropdown toggle
            size: 22,
        },
        arrowDown: {
            name: "keyboard-arrow-down", // dropdown toggle
            size: 22,
        },
        selectArrowDown: {
            name: "keyboard-arrow-down", // select
            size: 24,
        },
        close: {
            name: "close", // chip close
            size: 16,
        },
        check: {
            name: "check", // selected item
            size: 16,
        },
        cancel: {
            name: "cancel", // cancel button
            size: 18,
        },
    },
    styles: {
        selectedItem: {
            backgroundColor: "rgba(0,0,0,0.1)",
        },
        selectedSubItem: {
            backgroundColor: "rgba(0,0,0,0.1)",
        },
        button: {
            backgroundColor: "green",
        },
    },
};
