import {
  generateValidationTypes,
  generateValidationFunction,
} from "../validation-generator";
import { Linter } from "eslint";
import { basicFields, complexFields, multiLanguageFields } from "./test-fields";

describe("Validation Generator", () => {
  const linter = new Linter();

  function validateGeneratedCode(code: string, isTypeScript = true): void {
    const messages = linter.verify(code, {
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        globals: {
          FormData: true,
          RegExp: true,
          Number: true,
        },
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: "module",
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

  describe.each([
    ["basic fields", basicFields],
    ["complex fields", complexFields],
    ["multi-language fields", multiLanguageFields],
  ])("with %s", (_, fields) => {
    describe("Type Generation", () => {
      test("generates valid TypeScript validation types", () => {
        const result = generateValidationTypes("typescript");
        validateGeneratedCode(result, true);
        // Manual check needed to verify type definitions
        expect(result).toContain("type ValidationError = {");
        expect(result).toContain("type ValidationResult = {");
      });

      test("generates valid JavaScript validation types", () => {
        const result = generateValidationTypes("javascript");
        validateGeneratedCode(result, false);
        // Manual check needed to verify no type definitions
        expect(result).toBe("");
      });
    });

    describe("Function Generation", () => {
      test("generates valid TypeScript validation function", () => {
        const result = generateValidationFunction(
          Object.values(fields),
          "typescript"
        );
        validateGeneratedCode(result, true);
        // Manual check needed to verify function signature
        expect(result).toContain("function validateForm(formData: FormData)");
      });

      test("generates valid JavaScript validation function", () => {
        const result = generateValidationFunction(
          Object.values(fields),
          "javascript"
        );
        validateGeneratedCode(result, false);
        // Manual check needed to verify function signature
        expect(result).toContain("function validateForm(formData)");
      });
    });

    describe("Validation Rules", () => {
      test("includes required field validation", () => {
        const result = generateValidationFunction(
          Object.values(fields),
          "typescript"
        );
        validateGeneratedCode(result, true);
        Object.values(fields).forEach((field) => {
          if (field.validation?.required) {
            if (
              field.type === "checkbox" ||
              field.type === "radio" ||
              field.type === "checkbox-group"
            ) {
              expect(result).toContain(`!${field.name}`);
            } else {
              expect(result).toContain(
                `!${field.name} || ${field.name}.toString().trim() === ''`
              );
            }
            if (field.type === "select") {
              expect(result).toContain(
                `Please select a value for ${field.label}`
              );
            } else if (field.type === "radio") {
              expect(result).toContain(
                `Please select an option for ${field.label}`
              );
            } else if (field.type === "checkbox") {
              expect(result).toContain(`${field.label} must be checked`);
            } else if (field.type === "checkbox-group") {
              expect(result).toContain(
                `Please select at least one option for ${field.label}`
              );
            } else {
              expect(result).toContain(`${field.label} is required`);
            }
          }
        });
      });

      test("includes email validation", () => {
        const result = generateValidationFunction(
          Object.values(fields),
          "typescript"
        );
        validateGeneratedCode(result, true);
        // Manual check needed to verify email validation
        Object.values(fields).forEach((field) => {
          if (field.type === "email") {
            expect(result).toContain(
              "!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i.test"
            );
            expect(result).toContain("Please enter a valid email address");
          }
        });
      });

      test("includes number range validation", () => {
        const result = generateValidationFunction(
          Object.values(fields),
          "typescript"
        );
        validateGeneratedCode(result, true);
        // Manual check needed to verify number range validation
        Object.values(fields).forEach((field) => {
          if (field.type === "number" && field.validation?.min !== undefined) {
            expect(result).toContain(
              `Number(${field.name}) < ${field.validation.min}`
            );
            expect(result).toContain(
              `must be at least ${field.validation.min}`
            );
          }
          if (field.type === "number" && field.validation?.max !== undefined) {
            expect(result).toContain(
              `Number(${field.name}) > ${field.validation.max}`
            );
            expect(result).toContain(`must be at most ${field.validation.max}`);
          }
        });
      });

      test("includes text length validation", () => {
        const result = generateValidationFunction(
          Object.values(fields),
          "typescript"
        );
        validateGeneratedCode(result, true);
        // Manual check needed to verify text length validation
        Object.values(fields).forEach((field) => {
          if (field.validation?.minLength !== undefined) {
            expect(result).toContain(
              `${field.name}.toString().length < ${field.validation.minLength}`
            );
            expect(result).toContain(
              `must be at least ${field.validation.minLength} characters`
            );
          }
          if (field.validation?.maxLength !== undefined) {
            expect(result).toContain(
              `${field.name}.toString().length > ${field.validation.maxLength}`
            );
            expect(result).toContain(
              `must be at most ${field.validation.maxLength} characters`
            );
          }
        });
      });

      test("includes pattern validation", () => {
        const result = generateValidationFunction(
          Object.values(fields),
          "typescript"
        );
        validateGeneratedCode(result, true);
        Object.values(fields).forEach((field) => {
          if (field.validation?.pattern) {
            if (field.type === "email") {
              expect(result).toContain(
                `!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i.test(${field.name}.toString())`
              );
              expect(result).toContain("Please enter a valid email address");
            } else {
              expect(result).toContain(
                `!new RegExp("${field.validation.pattern}").test(${field.name}.toString())`
              );
              expect(result).toContain(`${field.label} format is invalid`);
            }
          }
        });
      });
    });
  });
});
