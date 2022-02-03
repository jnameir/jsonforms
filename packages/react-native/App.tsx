import { JsonForms } from '@jsonforms/react';
import { isEmpty, isEqual } from 'lodash';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import demoSchema from "./demoSchemas/schema.json";
import demoUiSchema from "./demoSchemas/uiSchema.json";
import { RNCells, RNRenderers } from './jsonforms';

export const App = (): JSX.Element => {
  const [stateData, setStateData] = useState({});
  const [stateErrors, setStateErrors] = useState([]);

  const onChange = ({ errors, data }) => {
    if (isEmpty(errors) || !isEqual(data, stateData)) {
      setStateData(data);
      setStateErrors(errors);
    } else {
      setStateErrors(errors);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
        <View style={styles.jsonFormsContainer}>
            <Text style={styles.title}>Example questionnaire</Text>
            <JsonForms
            schema={demoSchema}
            uischema={demoUiSchema}
            data={stateData}
            renderers={RNRenderers}
            cells={RNCells}
            onChange={onChange}
            />
        </View>
      <View style={styles.infoWrapper}>
        <View>
          <Text style={styles.title}>Schema</Text>
          <ScrollView contentContainerStyle={styles.infoContainer}>
            <SyntaxHighlighter language='json'>
              {JSON.stringify(demoSchema, null, 2)}
            </SyntaxHighlighter>
          </ScrollView>
          <Text style={styles.title}>UI schema</Text>
          <ScrollView contentContainerStyle={styles.infoContainer}>
            <SyntaxHighlighter language='json'>
              {JSON.stringify(demoUiSchema, null, 2)}
            </SyntaxHighlighter>
          </ScrollView>
        </View>
        <View>
          <Text style={styles.title}>Errors</Text>
          <ScrollView contentContainerStyle={styles.infoContainer}>
            <SyntaxHighlighter language='json'>
              {JSON.stringify(stateErrors, null, 2)}
            </SyntaxHighlighter>
          </ScrollView>
          <Text style={styles.title}>Data</Text>
          <ScrollView contentContainerStyle={styles.infoContainer}>
            <SyntaxHighlighter language='json'>
              {JSON.stringify(stateData, null, 2)}
            </SyntaxHighlighter>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    width: '100%',
    justifyContent: 'center'
  },
  jsonFormsContainer: {
    width: '100%',
    height: '50%',
    padding: 80,
    marginBottom: 80,
  },
  infoWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  infoContainer: {
    height: 200,
    width: 300,
    backgroundColor: 'lightgray'
  },
  title: {
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#11468F',
    fontSize: 24,
  },
});

export default App;
