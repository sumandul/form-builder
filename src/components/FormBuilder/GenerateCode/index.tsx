import { Form } from "../types";
export const generateFormCode = (form: Form) => {
  const formCode = `
    import React from "react";
    import { useForm } from "react-hook-form";
    
    const GeneratedForm = () => {
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    
      const onSubmit = (data) => {
        console.log("Form Data:", data);
      };
    
      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-${form.columns} gap-4">
            ${form?.fields
              ?.map((field) => {
                if (field.type === "password") {
                  return `
                <div key="${field.label}" className="flex flex-col">
                  <input
                    id="field-${field.label
                      .replace(/\\s+/g, "-")
                      .toLowerCase()}"
                    type="password"
                    placeholder="${field.label}"
                    {...register("${field.label}", {
                      required: ${
                        field.required
                          ? `"${field.label} is required"`
                          : "false"
                      },
                      ${
                        form?.passwordPattern?.minLength
                          ? `minLength: { value: ${form.passwordPattern.minLength}, message: "${field.label} must be at least ${form.passwordPattern.minLength} characters" },`
                          : ""
                      }
                      ${
                        form?.passwordPattern?.maxLength
                          ? `maxLength: { value: ${form.passwordPattern.maxLength}, message: "${field.label} must not exceed ${form.passwordPattern.maxLength} characters" },`
                          : ""
                      }
                      ${
                        form?.passwordPattern?.pattern
                          ? `pattern: { value: new RegExp('${form.passwordPattern.combinedPattern}'), message: "${field.label}  should contain ${form.passwordPattern.message}" },`
                          : ""
                      }
                    })}
                    className="border p-2 rounded"
                  />
                  {errors["${field.label}"] && (
                    <span className="text-red-500 text-sm">{errors["${
                      field.label
                    }"].message}</span>
                  )}
                </div>
                  `;
                } else if (field.type === "text") {
                  return `
                <div key="${field.label}" className="flex flex-col">
                  <input
                    id="field-${field.label
                      .replace(/\\s+/g, "-")
                      .toLowerCase()}"
                    type="text"
                    placeholder="${field.label}"
                    {...register("${field.label}", {
                      required: ${
                        field.required
                          ? `"${field.label} is required"`
                          : "false"
                      },
                    })}
                    className="border p-2 rounded"
                  />
                  {errors["${field.label}"] && (
                    <span className="text-red-500 text-sm">{errors["${
                      field.label
                    }"].message}</span>
                  )}
                </div>
                  `;
                } else if (field.type === "checkbox") {
                  return `
                <div key="${field.label}" className="flex items-center gap-2">
                  <input
                    id="field-${field.label
                      .replace(/\\s+/g, "-")
                      .toLowerCase()}"
                    type="checkbox"
                    {...register("${field.label}", {
                      required: ${
                        field.required
                          ? `"${field.label} is required"`
                          : "false"
                      },
                    })}
                  />
                  <label htmlFor="field-${field.label
                    .replace(/\\s+/g, "-")
                    .toLowerCase()}">
                    ${field.label}
                  </label>
                  {errors["${field.label}"] && (
                    <span className="text-red-500 text-sm">{errors["${
                      field.label
                    }"].message}</span>
                  )}
                </div>
                  `;
                }
                return "";
              })
              .join("")}
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
            Submit
          </button>
        </form>
      );
    };
    
    export default GeneratedForm;
    `;

  // Copy code to clipboard
  navigator.clipboard
    .writeText(formCode)
    .then(() => console.log("Code copied to clipboard"))
    .catch((err) => console.error("Failed to copy code:", err));

  return formCode;
};

export default generateFormCode;
