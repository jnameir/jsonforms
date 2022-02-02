import { JsonForms } from "@jsonforms/react";
import bind from 'bind-decorator';
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import exampleSchema from "./exampleSchemas/schema.json";
import exampleUiSchema from "./exampleSchemas/uiSchema.json";
import { RNCells, RNRenderers } from "./jsonforms";


const initialData = {};
interface State {
    data: typeof initialData | any;
    errors: [];
}
export default class App extends React.Component<unknown, State> {
    constructor(props) {
        super(props);
        this.state = { data: {}, errors: [] };
    }

    @bind
    private onChange({ errors, data }) {
        this.setState({ data, errors });
    }

    public render() {
        return (
            <View style={style.container}>
                <View>
                    <Text style={style.primTitle}>Example Questionnaire</Text>
                    <JsonForms
                        schema={exampleSchema}
                        uischema={exampleUiSchema}
                        data={this.state.data}
                        renderers={RNRenderers}
                        cells={RNCells}
                        onChange={this.onChange}
                    />
                </View>
                <View>
                <Text style={style.primTitle}>Data</Text>
                    <Text>{JSON.stringify(this.state.data, null, "\t")}</Text>
                </View>
            </View>
        );
    }
}


export const style = StyleSheet.create({
    container: {
        padding: 48,
        display: "flex",
        height: "100%",
        backgroundColor: "#F1F1F1",
    },
    primTitle: {
        fontSize: 24,
        marginTop: 12,
        marginBottom: 12,
        fontWeight: "bold",
        color: "#132C33",
    },
})