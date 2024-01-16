/* eslint-disable no-param-reassign */
import { SchemaForm } from "frontend/components/SchemaForm";
import { useState } from "react";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import {
  ActionIntegrations,
  IActionInstance,
  IIntegrationsList,
} from "shared/types/actions";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { DataEventActions } from "shared/types/data";
import { useIntegrationImplementationsList } from "./instances.store";
import { ADMIN_ACTION_INSTANCES_CRUD_CONFIG } from "./constants";

interface IProps {
  onSubmit: (instance: IActionInstance) => Promise<void>;
  initialValues?: Partial<IActionInstance>;
  formAction: "create" | "update";
  integrationsList: IIntegrationsList[];
  activatedIntegrations: ActionIntegrations[];
  entity: string;
}

const CONFIGURATION_FORM_PREFIX = "configuration__";

export function ActionForm({
  onSubmit,
  initialValues = {},
  formAction,
  integrationsList,
  activatedIntegrations,
  entity,
}: IProps) {
  const integrationsListMap = Object.fromEntries(
    integrationsList.map((action) => [action.key, action])
  );
  const activatedOptions = activatedIntegrations.map((integration) => ({
    label: integrationsListMap[integration].title,
    value: integration,
  }));

  const [formValues, setFormValues] = useState<Partial<IActionInstance>>({});

  const implementations = useIntegrationImplementationsList(
    formValues.integration
  );

  const currentActionTitle = integrationsListMap[formValues.integration]?.title;

  const selectedImplementation = Object.fromEntries(
    Object.entries(
      implementations.data.find(({ key }) => key === formValues.action)
        ?.configurationSchema || {}
    ).map(([key, value]) => [
      `${CONFIGURATION_FORM_PREFIX}${key}`,
      { ...value, label: `${currentActionTitle}: ${userFriendlyCase(key)}` },
    ])
  );

  const fields: IAppliedSchemaFormConfig<any> = {
    trigger: {
      label: "Trigger",
      type: "selection",
      selections: [
        {
          label: "On Create",
          value: DataEventActions.Create,
        },
        {
          label: "On Update",
          value: DataEventActions.Update,
        },
        {
          label: "On Delete",
          value: DataEventActions.Delete,
        },
      ],
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    integration: {
      label: "Integration",
      selections: activatedOptions,
      type: "selection",
      validations: [{ validationType: "required" }],
      formState: ($) => ({
        disabled: $.action === "update" || !$.formValues.trigger,
      }),
    },
    action: {
      label: "Action",
      type: "selection",
      validations: [{ validationType: "required" }],
      selections: implementations.data.map(({ key, label }) => ({
        label,
        value: key,
      })),
      formState: ($) => ({
        disabled: !$.formValues.trigger,
      }),
    },
    ...selectedImplementation,
  };
  initialValues = { ...initialValues, entity };

  const initialValues$1 = Object.entries(
    initialValues.configuration || {}
  ).reduce((values, [key, value]) => {
    return { ...values, [`${CONFIGURATION_FORM_PREFIX}${key}`]: value };
  }, initialValues);

  return (
    <SchemaForm<IActionInstance>
      buttonText={
        formAction === "create"
          ? ADMIN_ACTION_INSTANCES_CRUD_CONFIG.FORM_LANG.CREATE
          : ADMIN_ACTION_INSTANCES_CRUD_CONFIG.FORM_LANG.UPDATE
      }
      initialValues={initialValues$1}
      fields={fields}
      systemIcon={formAction === "create" ? "Plus" : "Save"}
      onChange={setFormValues}
      action={formAction}
      onSubmit={async (instance) => {
        const cleanedConfigurationForm = Object.entries(instance).reduce(
          (cleanForm, [formKey, formValue]) => {
            if (formKey.startsWith(CONFIGURATION_FORM_PREFIX)) {
              const key = formKey.replace(CONFIGURATION_FORM_PREFIX, "");
              return {
                ...cleanForm,
                configuration: { ...cleanForm.configuration, [key]: formValue },
              };
            }
            return { ...cleanForm, [formKey]: formValue };
          },
          { configuration: {} }
        ) as IActionInstance;

        await onSubmit(cleanedConfigurationForm);
      }}
    />
  );
}
