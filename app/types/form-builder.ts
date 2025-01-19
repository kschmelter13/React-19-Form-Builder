export type FormField = {
  id: string;
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio";
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
};

export type FormState = {
  fields: FormField[];
  title: string;
  description?: string;
};
