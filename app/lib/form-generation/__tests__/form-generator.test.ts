import { generateFormCode } from "../form-generator";
import { FormState } from "../../../types/form-builder";
import { Linter } from "eslint";

describe("Form Generator", () => {
  const mockBasicForm: FormState = {
    title: "Contact Form",
    description: "Please fill out the form below",
    fields: [
      {
        id: "1",
        type: "text",
        name: "name",
        label: "Name",
        validation: { required: true },
      },
      {
        id: "2",
        type: "email",
        name: "email",
        label: "Email",
        validation: { required: true },
      },
    ],
  };

  const mockComplexForm: FormState = {
    title: "Complex Form",
    description: "Form with all field types",
    fields: [
      {
        id: "1",
        type: "text",
        name: "username",
        label: "Username",
        validation: { required: true, minLength: 3 },
      },
      {
        id: "2",
        type: "email",
        name: "email",
        label: "Email",
        validation: { required: true },
      },
      {
        id: "3",
        type: "select",
        name: "country",
        label: "Country",
        options: [
          { value: "us", label: "United States" },
          { value: "uk", label: "United Kingdom" },
        ],
        validation: { required: true },
      },
    ],
  };

  const linter = new Linter();

  function validateGeneratedCode(code: string, isTypeScript = true): void {
    const messages = linter.verify(code, {
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        globals: {
          FormData: true,
          React: true,
          useActionState: true,
          useOptimistic: true,
          console: true,
          Promise: true,
          Object: true,
          document: true,
          window: true,
        },
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: "module",
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
      rules: {
        "no-undef": "error",
        "no-dupe-keys": "error",
      },
    });

    if (messages.length > 0) {
      const relevantErrors = messages.filter(
        (msg) =>
          !isTypeScript ||
          !msg.message.includes("Parsing error: Unexpected token")
      );

      if (relevantErrors.length > 0) {
        throw new Error(
          `Generated code contains linting errors:\n${relevantErrors
            .map((e) => `${e.line}:${e.column} - ${e.message}`)
            .join("\n")}`
        );
      }
    }
  }

  describe("Language Variations", () => {
    test("generates valid TypeScript form", () => {
      const result = generateFormCode(mockBasicForm, {
        languageType: "typescript",
        styleType: "tailwind",
      });
      validateGeneratedCode(result, true);
    });

    test("generates valid JavaScript form", () => {
      const result = generateFormCode(mockBasicForm, {
        languageType: "javascript",
        styleType: "tailwind",
      });
      validateGeneratedCode(result, false);
    });
  });

  describe("Style System", () => {
    test("generates Tailwind-styled form", () => {
      const result = generateFormCode(mockBasicForm, {
        languageType: "typescript",
        styleType: "tailwind",
      });
      validateGeneratedCode(result, true);
      expect(result).toContain('className="');
      expect(result).not.toContain("style={");
    });

    test("generates CSS-in-JS form", () => {
      const result = generateFormCode(mockBasicForm, {
        languageType: "typescript",
        styleType: "css",
      });
      validateGeneratedCode(result, true);
      expect(result).toContain("style={");
      expect(result).not.toContain('className="');
    });
  });

  describe("Form Structure", () => {
    test("includes form metadata", () => {
      const result = generateFormCode(mockBasicForm, {
        languageType: "typescript",
        styleType: "tailwind",
      });
      validateGeneratedCode(result, true);
      expect(result).toContain(mockBasicForm.title);
      expect(result).toContain(mockBasicForm.description);
    });

    test("includes form fields", () => {
      const result = generateFormCode(mockBasicForm, {
        languageType: "typescript",
        styleType: "tailwind",
      });
      validateGeneratedCode(result, true);
      mockBasicForm.fields.forEach((field) => {
        expect(result).toContain(field.name);
        expect(result).toContain(field.label);
      });
    });

    test("includes submit button", () => {
      const result = generateFormCode(mockBasicForm, {
        languageType: "typescript",
        styleType: "tailwind",
      });
      validateGeneratedCode(result, true);
      expect(result).toContain("<button");
      expect(result).toContain('type="submit"');
    });
  });

  describe("State Management", () => {
    test("includes form state handling", () => {
      const result = generateFormCode(mockBasicForm, {
        languageType: "typescript",
        styleType: "tailwind",
      });
      validateGeneratedCode(result, true);
      expect(result).toContain("useActionState");
      expect(result).toContain("formAction");
    });

    test("includes error handling", () => {
      const result = generateFormCode(mockBasicForm, {
        languageType: "typescript",
        styleType: "tailwind",
      });
      validateGeneratedCode(result, true);
      expect(result).toContain("state?.errors");
      expect(result).toContain("message: '");
    });
  });

  describe("Field Integration", () => {
    test("integrates all field types correctly", () => {
      const result = generateFormCode(mockComplexForm, {
        languageType: "typescript",
        styleType: "tailwind",
      });
      validateGeneratedCode(result, true);
      mockComplexForm.fields.forEach((field) => {
        expect(result).toContain(field.name);
        expect(result).toContain(field.label);
        expect(result).toContain(`error => error.field === '${field.name}'`);
      });

      const selectField = mockComplexForm.fields.find(
        (f) => f.type === "select"
      );
      selectField?.options?.forEach((option) => {
        expect(result).toContain(`value="${option.value}"`);
        expect(result).toContain(option.label);
      });
    });
  });

  describe("Edge Cases", () => {
    test("handles special characters", () => {
      const specialForm: FormState = {
        title: "Test's Form & More",
        description: 'Form with "special" characters',
        fields: [
          {
            id: "1",
            type: "text",
            name: "test",
            label: "Test's Field",
            validation: { required: true },
          },
        ],
      };

      const result = generateFormCode(specialForm, {
        languageType: "typescript",
        styleType: "tailwind",
      });
      validateGeneratedCode(result, true);
      expect(result).toContain("Test's Form & More</h1>");
      expect(result).toContain('Form with "special" characters</p>');
      expect(result).toContain("Test's Field");
    });

    test("handles empty form state", () => {
      const emptyForm: FormState = {
        title: "",
        description: "",
        fields: [],
      };

      const result = generateFormCode(emptyForm, {
        languageType: "typescript",
        styleType: "tailwind",
      });
      validateGeneratedCode(result, true);
      expect(result).toContain("export default function GeneratedForm()");
      expect(result).toContain("<form");
      expect(result).toContain("</form>");
      expect(result).toContain("const errors = [];");
      expect(result).toContain("isValid: errors.length === 0");
    });
  });
});
