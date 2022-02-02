# JSON Forms - More Forms. Less Code

*Complex forms in the blink of an eye*

JSON Forms eliminates the tedious task of writing fully-featured forms by hand by leveraging the capabilities of JSON, JSON Schema and Javascript.

## React Native Package

This is the JSON Forms React Native package which provides the necessary bindings for React Native. It uses [JSON Forms Core](https://github.com/eclipsesource/jsonforms/blob/master/packages/core).

See the official [documentation](https://jsonforms.io/) and the JSON Forms React [seed repository](https://github.com/eclipsesource/jsonforms-react-seed) for examples on how to integrate JSON Forms with your application.

Check <https://www.npmjs.com/search?q=%40jsonforms> for all published JSON Forms packages.

## Branched questionnaire support 

This package contains an additional renderer, the conditional control renderer (ConditionalControl.tsx) 

The motivation behind adding this component was to offer a neat solution for nested questionnaires.

In many questionnaires two questions are connected (top level + sub question). 

The first one is usually in a form of Yes/No and second one is an option to clarify (multi/single select or text field). 

Usually the second one becomes mandatory or prohibited depending on the answer from the first one.

Therefore the conditional renderer was introduced. It simplifies our schemas + ui schemas and makes manual data cleaning obsolete.

### Branched questionnaire support: Usage of the conditional renderer

#### Schema

The "enum pool" in the schema (see example below) contains ALL possible answer options.

All possible options = All answer options of the subquestion multi select + the answer option of the top level question that does not lead to a subquestion (in our example: "yes"). 

Example:

```
"examplePath": {
    "title": "Example question label?",
    "type": "array",
    "items": {
        "type": "string",
        "enum": [
            "yes",
            "a",
            "b",
            "c",
            "d"
        ]
    }
},
```
 


#### UI Schema

The "format":“conditional” (example below l. 5) is a flag that will trigger conditional rendering.

Assign the label that should NOT lead to multi select rendering to "nonConditionalLabel", e.g. "yes".

Values from the “enum pool” of the schema are assigned to the top-level conditional options/labels.

If data is preloaded, the correct conditional top-level option will be selected by analyzing from which array in the UI schema the data is from.

```
{
    "type": "Control",
    "scope": "#/properties/examplePath",
    "options": {
        "format": "conditional",
        "type": "enum",
        "content": {
            "yes": ["yes"],
            "no": [
                "a", "b", "c", "d"
            ]
        },
        "nonConditionalLabel": "yes"
    }
},
```

The ConditionalControl component will not render a multi select component although an array with option(s) is present ("content": { "yes": ["yes"] }, example above) if the value of the nonConditionalLabel is that of the currently selected option of the top level question.


#### Data collection

Data gets stored like so:


"examplePath": ["yes"], 

OR

"examplePath": ["a", "b"]

in case of multi select options. 


### General Usage JSON forms

Use the `JsonForms` component to render a form for your data.

Mandatory props:

* `data: any` - the data to show
* `renderers: JsonFormsRendererRegistryEntry[]` - the React renderer set to use

Optional props:

* `schema: JsonSchema` - the data schema for the given data. Will be generated when not given.
* `uischema: UISchemaElement` - the UI schema for the given data schema. Will be generated when not given.
* `cells: JsonFormsCellRendererRegistryEntry[]` - the React cell renderer set to use
* `config: any` - form-wide options. May contain default ui schema options.
* `readonly: boolean` - whether all controls shall be readonly.
* `uischemas: JsonFormsUiSchemaEntry[]` - registry for dynamic ui schema dispatching
* `validationMode: 'ValidateAndShow' | 'ValidateAndHide' | 'NoValidation'` - the validation mode for the form
* `ajv: AJV` - custom Ajv instance for the form
* `onChange` - callback which is called on each data change, containing the updated data and the validation result.

## License

The JSON Forms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.

## Roadmap

Our current roadmap is available [here](https://github.com/eclipsesource/jsonforms/blob/master/ROADMAP.md).

## Feedback, Help and Support

JSON Forms is developed by [EclipseSource](https://eclipsesource.com).

If you encounter any problems feel free to [open an issue](https://github.com/eclipsesource/jsonforms/issues/new/choose) on the repo.
For questions and discussions please use the [JSON Forms board](https://jsonforms.discourse.group).
You can also reach us via [email](mailto:jsonforms@eclipsesource.com?subject=JSON%20Forms).
In addition, EclipseSource also offers [professional support](https://jsonforms.io/support) for JSON Forms.
