import { useState } from "react";
import { Input } from "../../common/FormUI";
import generateFormCode from "../GenerateCode";
const PreviewForm = ({ form }: any) => {
  console.log(form, "hh");
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyCode = (data: any) => {
    console.log(data, "data");
    generateFormCode(data);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  return (
    <div>
      <div className=" shadow-dark rounded-xl  flex-1 p-5 basis-1/2">
        <form>
          <div className={`grid grid-cols-${form.columns} gap-4`}>
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
          <div className={`flex justify-${form.buttonAlignment} mt-1`}>
            <button
              style={{
                backgroundColor: form.color,
                color: form.textColor,
                borderRadius: `${form.buttonRadius}%`,
              }}
              className={`px-4   py-3`}
            >
              {form.buttonText}
            </button>
          </div>
        </form>
      </div>
      <div className="  overflow-y-auto    overflow-x-auto">
        <pre className="bg-gray-900 text-white p-4 basis-1/2 rounded overflow-x-auto">
          <button className=" relative" onClick={() => handleCopyCode(form)}>
            <span className="material-symbols-outlined">content_copy</span>
            {isCopied && (
              <div className="mt-4 absolute top-[-1rem] right-[-20rem] text-green-600 font-semibold">
                ✅ Code copied to clipboard!
              </div>
            )}
          </button>

          <code>{generateFormCode(form)}</code>
        </pre>
      </div>
    </div>
  );
};

export default PreviewForm;
