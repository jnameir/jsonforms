import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { RNCells, RNRenderers } from './jsonforms';
import { schemas, uiSchemas } from './src/schemas';
import SyntaxHighlighter from 'react-native-syntax-highlighter';

export const App = (): JSX.Element => {
  const [stateData, setStateData] = useState({});
  const [stateErrors, setStateErrors] = useState([]);

  const [schema, setSchema] = useState<JsonSchema>(schemas.boolean);
  const [uiSchema, setUiSchema] = useState<UISchemaElement>(
    uiSchemas.booleanUi
  );

  const onChange = ({ errors, data }) => {
    // const cleanedData = formatKbsData(data);

    if (isEmpty(errors)) {
      setStateData(data);
      setStateErrors(errors);
    } else {
      setStateErrors(errors);
    }
  };

  const onChangeSchema = (schemaName: string) => {
    setSchema(schemas[schemaName]);
    setUiSchema(uiSchemas[`${schemaName}Ui`]);
    setStateData({});
    setStateErrors([]);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.navBar}>
        <Button title={'Boolean'} onPress={() => onChangeSchema('boolean')} />
        <Button title={'Date'} onPress={() => onChangeSchema('date')} />
        <Button title={'DateTime'} onPress={() => onChangeSchema('dateTime')} />
        <Button title={'Enum'} onPress={() => onChangeSchema('enum')} />
        <Button title={'Integer'} onPress={() => onChangeSchema('tnteger')} />
        <Button
          title={'multiEnum'}
          onPress={() => onChangeSchema('multiEnum')}
        />
        <Button title={'Number'} onPress={() => onChangeSchema('number')} />
        <Button
          title={'NumberFormat'}
          onPress={() => onChangeSchema('numberFormat')}
        />
        <Button title={'TextArea'} onPress={() => onChangeSchema('textArea')} />
        <Button title={'Text'} onPress={() => onChangeSchema('text')} />
        <Button title={'Time'} onPress={() => onChangeSchema('time')} />
      </View>
      <View style={styles.jsonFormsContainer}>
        <JsonForms
          schema={schema}
          uischema={uiSchema}
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
              {JSON.stringify(schema, null, 2)}
            </SyntaxHighlighter>
          </ScrollView>
          <Text style={styles.title}>UI schema</Text>
          <ScrollView contentContainerStyle={styles.infoContainer}>
            <SyntaxHighlighter language='json'>
              {JSON.stringify(uiSchema, null, 2)}
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
    height: '30%',
    paddingTop: 50
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
    marginTop: 5,
    fontWeight: 'bold',
    color: 'gray'
  },
  navBar: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
});

export default App;
