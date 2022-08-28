import { ButtonLang } from "@hadmean/protozoa";
import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/lib/form/SchemaForm";

type IDateFormatSettings = {
  format: string;
};

export function DateFormatSettingsForm({
  onSubmit,
  initialValues,
}: IFormProps<IDateFormatSettings>) {
  return (
    <SchemaForm<IDateFormatSettings>
      onSubmit={onSubmit}
      initialValues={initialValues}
      buttonText={`${ButtonLang.update} Date Format`}
      fields={{
        format: {
          type: "text",
          validations: [
            {
              validationType: "required",
            },
          ],
        },
      }}
    />
  );
}