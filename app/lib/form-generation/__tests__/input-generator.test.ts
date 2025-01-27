import { generateInputCode } from "../input-generator";
import { FormField } from "../../../types/form-builder";
import { Linter } from "eslint";
import { basicFields, complexFields, multiLanguageFields } from "./test-fields";

describe("Input Generator", () => {
  const linter = new Linter();

  function validateGeneratedJSX(code: string, isTypeScript = true): void {
    const messages = linter.verify(code, {
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        globals: {
          FormData: true,
          React: true,
          state: true,
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

  describe.each([
    ["basic fields", basicFields],
    ["complex fields", complexFields],
    ["multi-language fields", multiLanguageFields],
  ])("with %s", (_, fields) => {
    describe("Field Generation", () => {
      test.each(Object.entries(fields))(
        "generates valid %s field code",
        (_, field) => {
          const tailwindResult = generateInputCode(field, "tailwind");
          const cssResult = generateInputCode(field, "css");

          validateGeneratedJSX(tailwindResult);
          validateGeneratedJSX(cssResult);
        }
      );
    });

    describe("Style System", () => {
      describe("Tailwind", () => {
        test("uses Tailwind classes for styling", () => {
          const result = generateInputCode(fields.text, "tailwind");
          validateGeneratedJSX(result);
          // Manual check needed to verify style system usage
          expect(result).toContain('className="');
          expect(result).not.toContain("style={");
        });

        test("includes required field indicator with Tailwind", () => {
          const result = generateInputCode(fields.text, "tailwind");
          validateGeneratedJSX(result);
          // Manual check needed to verify required field styling
          expect(result).toContain('className="text-red-500"');
          expect(result).toContain("*");
        });
      });

      describe("CSS-in-JS", () => {
        test("uses inline styles for styling", () => {
          const result = generateInputCode(fields.text, "css");
          validateGeneratedJSX(result);
          // Manual check needed to verify style system usage
          expect(result).toContain("style={");
          expect(result).not.toContain('className="');
        });

        test("includes required field indicator with inline styles", () => {
          const result = generateInputCode(fields.text, "css");
          validateGeneratedJSX(result);
          // Manual check needed to verify required field styling
          expect(result).toContain('style={{ color: "#ef4444" }}');
          expect(result).toContain("*");
        });
      });
    });

    describe("Form State Integration", () => {
      test("integrates with form state for single values", () => {
        const result = generateInputCode(fields.text, "tailwind");
        validateGeneratedJSX(result);
        // Manual check needed to verify state integration
        expect(result).toContain("state?.formData?.get(");
      });

      test("integrates with form state for array values", () => {
        const result = generateInputCode(fields.checkboxGroup, "tailwind");
        validateGeneratedJSX(result);
        // Manual check needed to verify array state handling
        expect(result).toContain("state?.formData?.getAll(");
      });

      test("handles error state integration", () => {
        const result = generateInputCode(fields.text, "tailwind");
        validateGeneratedJSX(result);
        // Manual check needed to verify error state handling
        expect(result).toContain(
          "state?.errors?.find(error => error.field ==="
        );
      });
    });

    describe("Field-Specific Features", () => {
      test("includes placeholder text when provided", () => {
        const result = generateInputCode(fields.text, "tailwind");
        validateGeneratedJSX(result);
        expect(result).toContain(`placeholder="${fields.text.placeholder}"`);
      });

      test("renders select options correctly", () => {
        const result = generateInputCode(fields.select, "tailwind");
        validateGeneratedJSX(result);
        fields.select.options?.forEach((option) => {
          expect(result).toContain(`value="${option.value}"`);
          expect(result).toContain(`>${option.label}<`);
        });
      });

      test("renders radio options correctly", () => {
        const result = generateInputCode(fields.radio, "tailwind");
        validateGeneratedJSX(result);
        fields.radio.options?.forEach((option) => {
          expect(result).toContain(`value="${option.value}"`);
          expect(result).toContain(`${option.label}`);
        });
      });

      test("renders checkbox group options correctly", () => {
        const result = generateInputCode(fields.checkboxGroup, "tailwind");
        validateGeneratedJSX(result);
        fields.checkboxGroup.options?.forEach((option) => {
          expect(result).toContain(`value="${option.value}"`);
          expect(result).toContain(`${option.label}`);
        });
      });
    });
  });
});
