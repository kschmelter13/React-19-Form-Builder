import { FormField } from "../../types/form-builder";

type StyleType = "tailwind" | "css";

export function generateInputCode(
  field: FormField,
  styleType: StyleType = "tailwind"
) {
  const baseInputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    transition: "border-color 0.2s",
  };

  const baseInputClass =
    "w-full px-4 py-3 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-colors";

  const labelStyle = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 500,
    marginBottom: "0.375rem",
  };

  const errorStyle = {
    fontSize: "0.875rem",
    color: "#ef4444",
    marginTop: "0.25rem",
  };

  const labelProps =
    styleType === "tailwind"
      ? `className="block text-sm font-medium mb-1.5"`
      : `style={${JSON.stringify(labelStyle)}}`;

  const errorProps =
    styleType === "tailwind"
      ? `className="text-sm text-red-500 mt-1"`
      : `style={${JSON.stringify(errorStyle)}}`;

  const requiredIndicator =
    styleType === "tailwind"
      ? '<span className="text-red-500">*</span>'
      : '<span style={{ color: "#ef4444" }}>*</span>';

  const validation = field.validation || {};
  let fieldCode = "";

  switch (field.type) {
    case "textarea":
      fieldCode = generateTextareaField(
        field,
        baseInputClass,
        baseInputStyle,
        styleType
      );
      break;
    case "select":
      fieldCode = generateSelectField(
        field,
        baseInputClass,
        baseInputStyle,
        styleType
      );
      break;
    case "checkbox":
      fieldCode = generateCheckboxField(field, styleType);
      break;
    case "checkbox-group":
      fieldCode = generateCheckboxGroupField(field, styleType);
      break;
    case "radio":
      fieldCode = generateRadioField(field, styleType);
      break;
    default:
      fieldCode = generateDefaultInputField(
        field,
        baseInputClass,
        baseInputStyle,
        styleType
      );
  }

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  return `      <div ${
    styleType === "tailwind"
      ? 'className="space-y-2"'
      : `style={${JSON.stringify(containerStyle)}}`
  }>
        <label htmlFor="${field.name}" ${labelProps}>
          ${field.label}${validation.required ? ` ${requiredIndicator}` : ""}
        </label>
        ${fieldCode}
        {state?.errors?.find(error => error.field === '${field.name}') && (
          <p ${errorProps}>
            {state.errors.find(error => error.field === '${
              field.name
            }')?.message}
          </p>
        )}
      </div>`;
}

function generateTextareaField(
  field: FormField,
  baseInputClass: string,
  baseInputStyle: Record<string, string>,
  styleType: StyleType
) {
  return `<textarea
          name="${field.name}"
          id="${field.name}"
          ${field.placeholder ? `placeholder="${field.placeholder}"` : ""}
          defaultValue={state?.formData?.get('${field.name}')?.toString() || ''}
          ${
            styleType === "tailwind"
              ? `className="${baseInputClass}"`
              : `style={${JSON.stringify(baseInputStyle)}}`
          }
          rows={4}
        />`;
}

function generateSelectField(
  field: FormField,
  baseInputClass: string,
  baseInputStyle: Record<string, string>,
  styleType: StyleType
) {
  return `<select
          name="${field.name}"
          id="${field.name}"
          defaultValue={state?.formData?.get('${field.name}')?.toString() || ''}
          ${
            styleType === "tailwind"
              ? `className="${baseInputClass}"`
              : `style={${JSON.stringify(baseInputStyle)}}`
          }
        >
          <option value="">Select an option</option>
${field.options
  ?.map(
    (option) =>
      `          <option value="${option.value}">${option.label}</option>`
  )
  .join("\n")}
        </select>`;
}

function generateCheckboxField(field: FormField, styleType: StyleType) {
  const checkboxClass =
    "h-4 w-4 text-black rounded border-gray-300 focus:ring-black";
  const checkboxStyle = {
    height: "1rem",
    width: "1rem",
  };
  const containerStyle = {
    display: "flex",
    alignItems: "center",
  };
  const labelStyle = {
    marginLeft: "0.5rem",
    fontSize: "0.875rem",
  };

  return `<div ${
    styleType === "tailwind"
      ? 'className="flex items-center"'
      : `style={${JSON.stringify(containerStyle)}}`
  }>
          <input
            type="checkbox"
            name="${field.name}"
            id="${field.name}"
            defaultChecked={state?.formData?.get('${field.name}') === 'on'}
            ${
              styleType === "tailwind"
                ? `className="${checkboxClass}"`
                : `style={${JSON.stringify(checkboxStyle)}}`
            }
          />
          <label 
            htmlFor="${field.name}"
            ${
              styleType === "tailwind"
                ? 'className="ml-2 text-sm"'
                : `style={${JSON.stringify(labelStyle)}}`
            }
          >
            ${field.label}
          </label>
        </div>`;
}

function generateRadioField(field: FormField, styleType: StyleType) {
  const radioClass = "h-4 w-4 text-black border-gray-300 focus:ring-black";
  const radioStyle = {
    height: "1rem",
    width: "1rem",
  };
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };
  const optionContainerStyle = {
    display: "flex",
    alignItems: "center",
  };
  const labelStyle = {
    marginLeft: "0.5rem",
    fontSize: "0.875rem",
  };

  return `<div ${
    styleType === "tailwind"
      ? 'className="space-y-2"'
      : `style={${JSON.stringify(containerStyle)}}`
  }>
${field.options
  ?.map(
    (option) => `          <div ${
      styleType === "tailwind"
        ? 'className="flex items-center"'
        : `style={${JSON.stringify(optionContainerStyle)}}`
    }>
            <input
              type="radio"
              name="${field.name}"
              id="${field.name}-${option.value}"
              value="${option.value}"
              defaultChecked={state?.formData?.get('${field.name}') === '${
      option.value
    }'}
              ${
                styleType === "tailwind"
                  ? `className="${radioClass}"`
                  : `style={${JSON.stringify(radioStyle)}}`
              }
            />
            <label
              htmlFor="${field.name}-${option.value}"
              ${
                styleType === "tailwind"
                  ? 'className="ml-2 text-sm"'
                  : `style={${JSON.stringify(labelStyle)}}`
              }
            >
              ${option.label}
            </label>
          </div>`
  )
  .join("\n")}
        </div>`;
}

function generateDefaultInputField(
  field: FormField,
  baseInputClass: string,
  baseInputStyle: Record<string, string>,
  styleType: StyleType
) {
  return `<input
          type="${field.type}"
          name="${field.name}"
          id="${field.name}"
          ${field.placeholder ? `placeholder="${field.placeholder}"` : ""}
          defaultValue={state?.formData?.get('${field.name}')?.toString() || ''}
          ${
            styleType === "tailwind"
              ? `className="${baseInputClass}"`
              : `style={${JSON.stringify(baseInputStyle)}}`
          }
        />`;
}

function generateCheckboxGroupField(field: FormField, styleType: StyleType) {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };
  const optionContainerStyle = {
    display: "flex",
    alignItems: "center",
  };
  const checkboxStyle = {
    height: "1rem",
    width: "1rem",
  };
  const labelStyle = {
    marginLeft: "0.5rem",
    fontSize: "0.875rem",
  };

  return `<div ${
    styleType === "tailwind"
      ? 'className="space-y-2"'
      : `style={${JSON.stringify(containerStyle)}}`
  }>
${field.options
  ?.map(
    (option) => `          <div ${
      styleType === "tailwind"
        ? 'className="flex items-center"'
        : `style={${JSON.stringify(optionContainerStyle)}}`
    }>
            <input
              type="checkbox"
              name="${field.name}"
              id="${field.name}-${option.value}"
              value="${option.value}"
              defaultChecked={state?.formData?.getAll('${
                field.name
              }')?.includes('${option.value}')}
              ${
                styleType === "tailwind"
                  ? 'className="h-4 w-4 text-black border-gray-300 focus:ring-black rounded"'
                  : `style={${JSON.stringify(checkboxStyle)}}`
              }
            />
            <label
              htmlFor="${field.name}-${option.value}"
              ${
                styleType === "tailwind"
                  ? 'className="ml-2 text-sm"'
                  : `style={${JSON.stringify(labelStyle)}}`
              }
            >
              ${option.label}
            </label>
          </div>`
  )
  .join("\n")}
        </div>`;
}
