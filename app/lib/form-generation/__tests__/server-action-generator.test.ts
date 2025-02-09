import { generateServerAction } from "../server-action-generator";
import { Linter } from "eslint";
import { basicFields, complexFields, multiLanguageFields } from "./test-fields";

describe("Server Action Generator", () => {
  const linter = new Linter();

  function validateGeneratedCode(code: string, isTypeScript = true): void {
    const messages = linter.verify(code, {
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        globals: {
          FormData: true,
          console: true,
          Promise: true,
          Object: true,
          validateForm: true,
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
    describe("Language Variations", () => {
      test("generates valid TypeScript server action", () => {
        const result = generateServerAction(Object.values(fields), {
          languageType: "typescript",
          actionName: "handleSubmit",
        });
        validateGeneratedCode(result, true);
        // Manual check needed to verify type annotations
        expect(result).toContain(
          "async function handleSubmit(prevState: any, formData: FormData): Promise<{ formData: FormData | null; errors: Array<{ field: string; message: string }>; success?: boolean; data?: any }>"
        );
      });

      test("generates valid JavaScript server action", () => {
        const result = generateServerAction(Object.values(fields), {
          languageType: "javascript",
          actionName: "handleSubmit",
        });
        validateGeneratedCode(result, false);
        // Manual check needed to verify no type annotations
        expect(result).toContain(
          "async function handleSubmit(prevState, formData)"
        );
      });
    });

    describe("Action Configuration", () => {
      test("uses custom action name", () => {
        const result = generateServerAction(Object.values(fields), {
          languageType: "typescript",
          actionName: "processForm",
        });
        validateGeneratedCode(result, true);
        expect(result).toContain("async function processForm");
      });

      test("includes field access comments", () => {
        const result = generateServerAction(Object.values(fields), {
          languageType: "typescript",
          actionName: "handleSubmit",
        });
        validateGeneratedCode(result, true);
        // Manual check needed to verify field access comments
        Object.values(fields).forEach((field) => {
          expect(result).toContain(
            `const ${field.name} = formData.get('${field.name}')`
          );
        });
      });
    });

    describe("Response Structure", () => {
      test("includes validation failure response", () => {
        const result = generateServerAction(Object.values(fields), {
          languageType: "typescript",
          actionName: "handleSubmit",
        });
        validateGeneratedCode(result, true);
        // Manual check needed to verify response structure
        expect(result).toContain(
          "return {\n      formData,\n      errors: validationResult.errors\n    }"
        );
      });

      test("includes success response", () => {
        const result = generateServerAction(Object.values(fields), {
          languageType: "typescript",
          actionName: "handleSubmit",
        });
        validateGeneratedCode(result, true);
        // Manual check needed to verify response structure
        expect(result).toContain(
          "return {\n    formData: null,\n    errors: [],\n    success: true,\n    data\n  }"
        );
      });
    });
  });
});
