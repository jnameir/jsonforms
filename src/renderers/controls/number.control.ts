import {BaseControl} from './base.control';
import {JsonFormsRenderer} from '../renderer.util';
import {
  and,
  rankWith,
  schemaTypeIs,
  uiTypeIs
} from '../../core/testers';

@JsonFormsRenderer({
  selector: 'jsonforms-number',
  tester: rankWith(2, and(
      uiTypeIs('Control'),
      schemaTypeIs('number')
  ))
})
class NumberControl extends BaseControl<HTMLInputElement> {
  protected configureInput(input: HTMLInputElement): void {
    input.type = 'number';
    input.step = '0.1';
    input.classList.add('form-control');
  }
  protected get valueProperty(): string {
    return 'valueAsNumber';
  }
  protected get inputChangeProperty(): string {
    return 'oninput';
  }
  protected get inputElement(): HTMLInputElement {
    return document.createElement('input');
  }
}