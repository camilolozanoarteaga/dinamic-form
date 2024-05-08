import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export type InputModel = {
  label: string;
  type: string;
  link?: string;
  value?: string;
  rules?: Rules;
  options?: any[];
  fieldName?: string;
  provideData?: ProvideDatum[];
};

export type ProvideDatum = {
  label: string;
  sourceValue: string;
  value: string;
};

export type Rules = {
  required: boolean;
};

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
})
export class DynamicFormComponent implements OnInit {
  @Input() model: Record<string, InputModel>;
  public dynamicFormGroup: FormGroup;
  public fields: any = [];

  constructor() {
    this.model = {};
    this.dynamicFormGroup = new FormGroup({});
  }

  ngOnInit() {
    console.log(this.model);
    const formGroupFields = this.getFormControlsFields();
    this.dynamicFormGroup = new FormGroup(formGroupFields);
  }

  private addValidator(
    rules: Rules
  ): (
    | ((control: AbstractControl<any, any>) => ValidationErrors | null)
    | ValidatorFn
    | null
  )[] {
    if (!rules) {
      return [];
    }

    const validators = Object.keys(rules).map((rule) => {
      switch (rule) {
        case 'required':
          return Validators.required;
        //add more case for future.
        default:
          return null;
      }
    });
    return validators;
  }

  private getFormControlsFields(): Record<string, AbstractControl> {
    const formGroupFields: Record<string, AbstractControl> = {};
    for (const field of Object.keys(this.model)) {
      const fieldProps = this.model[field];
      const validators = this.addValidator(fieldProps.rules);

      const control = new FormControl(fieldProps.value, []);
      formGroupFields[field] = control;

      console.log({ ...fieldProps, fieldName: field });
      this.fields.push({ ...fieldProps, fieldName: field });
    }

    return formGroupFields;
  }

  save() {
    console.log(this.dynamicFormGroup.value);
    console.log(this.dynamicFormGroup.valid);
  }
}
