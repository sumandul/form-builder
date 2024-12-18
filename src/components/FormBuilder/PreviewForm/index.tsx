import { useState } from "react";
import { Input } from "../../common/FormUI";
import generateFormCode from "../GenerateCode";
const PreviewForm = ({ form }: any) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCode = (data: any) => {
    generateFormCode(data);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="shadow rounded-xl p-5 flex-1">
        <form>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${
                form.columns || 1
              }, minmax(0, 1fr))`,
            }}
          >
            {form?.fields?.map((field: any, id: number) => (
              <div key={id} className="flex flex-col">
                {field.type === "text" || field.type === "password" ? (
                  <Input
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    label={field.label}
                    required={field.required}
                    className="border p-2 rounded w-full"
                  />
                ) : field.type === "checkbox" ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`field-${field.id}`}
                      required={field.required}
                    />
                    <label htmlFor={`field-${field.id}`}>{field.label}</label>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div
            className={`flex justify-${form.buttonAlignment} mt-4`}
            style={{
              justifyContent: form.buttonAlignment || "center",
            }}
          >
            <button
              style={{
                backgroundColor: form.color,
                color: form.textColor,
                borderRadius: `${form.buttonRadius}%`,
              }}
              className="px-4 py-3"
            >
              {form.buttonText}
            </button>
          </div>
        </form>
      </div>
      <div className="overflow-auto bg-gray-900 text-white p-4 rounded">
        <button className="relative" onClick={() => handleCopyCode(form)}>
          <span className="material-symbols-outlined">content_copy</span>
          {isCopied && (
            <div className="absolute top-[-1rem] right-0 text-green-600 font-semibold">
              ✅ Code copied to clipboard!
            </div>
          )}
        </button>
        <pre>
          <code>{generateFormCode(form)}</code>
        </pre>
      </div>
    </div>
  );
};

export default PreviewForm;
