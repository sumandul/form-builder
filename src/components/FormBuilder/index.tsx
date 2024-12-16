// "use client";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import Input from "../common/FormUI/Input";

import colorToHex from "../../utils/convertohex";
import ButtonSetting from "./ButtonSetting";
import PasswordSetting from "./PasswodSetting";
import "@rc-component/color-picker/assets/index.css";
import { useTypedSelector } from "../../store/hooks";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../RadixComponents/Popover";
export default function FormBuilder() {
  const [open, setOpen] = useState(false);
  const passwordPattern = useTypedSelector(
    (state) => state.common.passwordPattern
  );

  console.log(passwordPattern, "passwordPattern");
  // console.log(showModal, "showModal");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [openPasswordSetting, setOpenPasswordSetting] = useState(false);
  const [passwordLength, setOpenPasswordLength] = useState({
    min_password_length: 8,
    max_password_length: 16,
  });
  const [buttonText, setButtonText] = useState("Save");
  const [buttonAlignment, setButtonAlignment] = useState("center");
  console.log(buttonAlignment, "buttonAlignment");
  const [buttonRadius, setButtonRadius] = useState(30);
  const [color, setColor] = useState("#FF4080");
  console.log(color, "color");
  const [textColor, setTextColor] = useState("#FF4080");

  const [fields, setFields] = useState([
    { id: "1", type: "text", label: "Label Text", required: false },
  ]);
  const [columns, setColumns] = useState(1);

  const [isMultiColumn, setIsMultiColumn] = useState({
    singleColumn: false,
    multiColumn: false,
  });
  const [savedForms, setSavedForms] = useState([]);

  const fetchFormsFromLocal = () => {
    try {
      const forms = JSON.parse(localStorage.getItem("savedForms") || "[]");
      setSavedForms(forms);
    } catch (error) {
      console.error("Error fetching forms from local storage:", error);
    }
  };

  useEffect(() => {
    fetchFormsFromLocal();
  }, []);

  const addNewField = () => {
    const newField = {
      id: Date.now().toString(),
      type: "text",
      label: "New Label",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, property: string, value: any) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, [property]: value } : field
      )
    );
  };
  const generateFormCode = (form) => {
    return `
import React from "react";
import { useForm } from "react-hook-form";
const GeneratedForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <form>
      <div className="grid grid-cols-${form.columns} gap-4">
        ${form.fields
          ?.map((field) => {
            if (field.type === "text" || field.type === "password") {
              return `
          <input 
            type="${field.type}" 
            placeholder="${field.label}" 
            required={${field.required}} 
            {...register(${field.label})}
            className="border p-2 rounded" 
          />`;
            } else if (field.type === "checkbox") {
              return `
          <div className="flex items-center gap-2">
            <input type="checkbox" id="field-${field.id}" required={${field.required}} />
            <label htmlFor="field-${field.id}">${field.label}</label>
          </div> {errors.${field.label} && <span>{errors.${field.label}.message}</span>}`;
            }
            return "";
          })
          .join("")}
      </div>
    </form>
  );
};

export default GeneratedForm;
    `;
  };

  const removeField = (id: string) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  const toggleColumnView = (text: string) => {
    if (text === "single") {
      setIsMultiColumn({
        singleColumn: true,
        multiColumn: false,
      });
    }

    if (text === "multicolumn") {
      setIsMultiColumn({
        ...isMultiColumn,
        multiColumn: true,
        singleColumn: false,
      });
    }
  };
  console.log(isMultiColumn, "isMultiColumn");
  const handeColor = (color) => {
    // console.log(colorToHex(color), "color");
    setColor(colorToHex(color));
  };
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If no valid destination, do nothing
    if (!destination) return;

    // If dropped in the same place, do nothing
    if (source.index === destination.index) return;

    // Replace the items
    const updatedFields = [...fields];
    const temp = updatedFields[source.index];
    updatedFields[source.index] = updatedFields[destination.index];
    updatedFields[destination.index] = temp;

    setFields(updatedFields);
  };
  const generateForm = (type) => {
    const formData = {
      fields,
      columns: columns,
      passwordPattern: type === "password" ? passwordLength : null,
    };

    try {
      // Retrieve existing forms from local storage
      const existingForms = JSON.parse(
        localStorage.getItem("savedForms") || "[]"
      );

      // Add the new form to the list
      existingForms.push(formData);

      // Save the updated list back to local storage
      localStorage.setItem("savedForms", JSON.stringify(existingForms));

      alert("Form saved successfully!");
    } catch (error) {
      console.error("Error saving form to local storage:", error);
    }
  };
  return (
    <div className="text-black">
      {/* <ColorPicker onChange={(color) => console.log(color)} /> */}
      <div className="bg-[#D9EAFD] flex items-center justify-center min-h-[15rem]">
        <h1 className="text-[2rem] font-bold">Form Builder</h1>
      </div>
      <div className="p-20">
        <div className="flex gap-10">
          {/* Form Style Section */}
          <div className="basis-1/2">
            {/* <h4 className="text-center font-medium text-xl">Form Style</h4> */}
            <div className=" flex items-center justify-center gap-4">
              <div className="w-full ">
                <label
                  htmlFor="single"
                  className=" bg-blue-300  text-white px-4 py-2 mb-4"
                  onClick={() => toggleColumnView("single")}
                >
                  Single Column <input id="single" type="radio" name="column" />
                </label>
              </div>
              <div className=" w-full flex gap-2  items-start">
                <label
                  htmlFor="multi"
                  className="bg-blue-300 text-white px-4 py-2 mb-4 "
                  onClick={() => toggleColumnView("multicolumn")}
                >
                  multi Column <input id="multi" type="radio" name="column" />
                </label>
                <Input
                  type="text"
                  label="Number of columns"
                  placeholder="Enter number of columns"
                  className="mb-4  border-2 border-gray-300 p-2 rounded"
                  onChange={(e) => setColumns(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Input
                placeholder=" Enter Form title"
                label="Form title"
                className="mb-4  border-2 border-gray-300 p-2 rounded"
              />
              <div className=" flex items-center gap-3">
                {" "}
                <Input
                  onChange={(e) => setButtonText(e.target.value)}
                  label="Button Text"
                  placeholder=" Enter button text"
                  className="mb-4  border-2 border-gray-300 p-2 rounded"
                />
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger>
                    <span
                      // ref={deleteRef}
                      className="material-symbols-outlined "
                      onClick={() => setOpen(!open)}
                    >
                      settings
                    </span>
                  </PopoverTrigger>
                  <PopoverContent className="w-full bg-white !p-[0px]">
                    <ButtonSetting
                      bgColor={color}
                      setColor={handeColor}
                      textColor={textColor}
                      setTextColor={setTextColor}
                      buttonRadius={buttonRadius}
                      setButtonRadius={setButtonRadius}
                      setButtonAlignment={setButtonAlignment}
                      buttonAlignment={buttonAlignment}
                    />
                  </PopoverContent>
                </Popover>
                <div className=" relative">
                  {/* {toggle == true && ( */}

                  {/* )} */}
                </div>
              </div>
            </div>
            <div className="bg-white p-5">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="flex gap-5 items-center bg-gray-50 p-2 rounded shadow mb-4"
                >
                  <select
                    className="border p-2 rounded"
                    onChange={(e) =>
                      updateField(field.id, "type", e.target.value)
                    }
                    value={field.type}
                  >
                    {[
                      { value: "text", label: "Text" },
                      { value: "password", label: "Password" },
                      { value: "checkbox", label: "Checkbox" },
                    ].map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="text"
                    placeholder=" Enter Label"
                    label="Label Text"
                    className="mb-4  border-2 border-gray-300 p-2 rounded"
                    onChange={(e) =>
                      updateField(field.id, "label", e.target.value)
                    }
                  />
                  {field.type !== "checkbox" && (
                    <Input
                      type="text"
                      placeholder=" Enter Placeholer"
                      label="Placeholder Text"
                      className="mb-4  border-2 border-gray-300 p-2 rounded"
                      onChange={(e) =>
                        updateField(field.id, "placeholder", e.target.value)
                      }
                    />
                  )}

                  <div className=" flex items-center gap-2">
                    <Input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) =>
                        updateField(field.id, "required", e.target.checked)
                      }
                    />
                    <span>Required</span>
                  </div>
                  <button
                    className="text-red-500"
                    onClick={() => removeField(field.id)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                  {field.type === "password" && (
                    <Popover
                      open={openPasswordSetting}
                      onOpenChange={setOpenPasswordSetting}
                    >
                      <PopoverTrigger>
                        <span
                          // ref={deleteRef}
                          className="material-symbols-outlined "
                          onClick={() => setOpenPasswordSetting(!open)}
                        >
                          settings
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="w-full bg-white !p-[0px]">
                        <PasswordSetting
                          setOpenPasswordLength={setOpenPasswordLength}
                          passwordLength={passwordLength}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              ))}
              <button
                onClick={addNewField}
                className="bg-blue-500 text-white px-4 py-2 mt-4"
              >
                Add New Field
              </button>
            </div>
          </div>

          {/* Form Preview Section */}
          <div className="basis-1/2  ">
            <h4 className="text-center font-medium text-xl">Form Preview</h4>

            <div className=" shadow-dark rounded-xl p-5">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="fields">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`grid grid-cols-${columns} gap-4`} // Ensure flex layout
                    >
                      {fields.map((field, index) => (
                        <Draggable
                          key={field.id}
                          draggableId={field.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white "
                            >
                              {field.type === "text" ||
                              field.type === "password" ? (
                                <Input
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  required={field.required}
                                  register={register}
                                  rules={
                                    field.type === "password"
                                      ? {
                                          required:
                                            field.required ||
                                            "This field is required.",
                                          minLength: {
                                            value:
                                              passwordPattern?.minLength || 6, // Default minimum length
                                            message: `Password must be at least ${
                                              passwordPattern?.minLength || 6
                                            } characters.`,
                                          },
                                          maxLength: {
                                            value:
                                              passwordPattern?.maxLength || 20, // Default maximum length
                                            message: `Password cannot exceed ${
                                              passwordPattern?.maxLength || 20
                                            } characters.`,
                                          },
                                          pattern: {
                                            value: passwordPattern?.pattern
                                              ? new RegExp(
                                                  passwordPattern?.pattern
                                                )
                                              : /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
                                            message:
                                              "Password must include at least one uppercase letter and one number.",
                                          },
                                        }
                                      : field.required
                                      ? { required: "This field is required." }
                                      : {}
                                  }
                                  label={field.label}
                                  className="mb-4  w-full border-2 border-gray-300 p-2 rounded"
                                />
                              ) : field.type === "checkbox" ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id={`field-${field.id}`}
                                  />
                                  <label htmlFor={`field-${field.id}`}>
                                    {field.label}
                                  </label>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <div className={`flex justify-${buttonAlignment} mt-1`}>
                <button
                  style={{
                    backgroundColor: color,
                    color: textColor,
                    borderRadius: `${buttonRadius}%`,
                  }}
                  // onClick={generateForm}
                  className={`px-4 rounded-[${buttonRadius}%] bg-[${color}] text-[${textColor}] py-3`}
                >
                  {buttonText}
                </button>
              </div>
            </div>
            <div className=" mt-10">
              <button
                onClick={() => generateForm(fields.type)}
                className=" w-full bg-green-500 text-white py-3"
              >
                Generate Fomrm
              </button>
            </div>
          </div>
        </div>
        <div>
          {/* <h2>Saved Forms</h2> */}
          <div>
            {savedForms.map((form, index) => (
              <div key={index} className=" p-4 mb-4 flex">
                {" "}
                <div>
                  <pre className="bg-gray-900 text-white p-4 rounded overflow-x-auto">
                    <code>{generateFormCode(form)}</code>
                  </pre>
                </div>
                <div>
                  <form>
                    <div className={`grid grid-cols-${form.columns} gap-4`}>
                      {form?.fields?.map((field, idx) => (
                        <div key={idx} className="flex flex-col">
                          {field.type === "text" ||
                          field.type === "password" ? (
                            <Input
                              type={field.type}
                              placeholder={field.label}
                              required={field.required}
                              className="border p-2 rounded"
                            />
                          ) : field.type === "checkbox" ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`field-${field.id}`}
                                required={field.required}
                              />
                              <label htmlFor={`field-${field.id}`}>
                                {field.label}
                              </label>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
