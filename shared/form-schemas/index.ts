import { IColorableSelection } from "frontend/views/entity/Configure/Fields/types";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { IFieldValidationItem } from "shared/validations/types";

export interface ISchemaFormConfig {
  selections?: IColorableSelection[];
  type: keyof typeof FIELD_TYPES_CONFIG_MAP;
  label?: string;
  validations: IFieldValidationItem[];
}
