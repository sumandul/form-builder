import { ChangeEvent, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import Input from "../common/FormUI/Input";
import colorToHex from "../../utils/convertohex";
import ButtonSetting from "./ButtonSetting";
import PasswordSetting from "./PasswodSetting";
import "@rc-component/color-picker/assets/index.css";
import { useTypedSelector } from "../../store/hooks";
import { Color } from "./types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../RadixComponents/Popover";
import PreviewForm from "./PreviewForm";
interface Field {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string; // Optional property
}
export default function FormBuilder() {
  const [open, setOpen] = useState(false);
  const passwordPattern = useTypedSelector(
    (state) => state.common.passwordPattern
  );

  console.log(passwordPattern, "passwordPattern");
  const { register } = useForm();

  const [openPasswordSetting, setOpenPasswordSetting] = useState(false);

  const [buttonText, setButtonText] = useState("Save");
  const [buttonAlignment, setButtonAlignment] = useState("center");
  const [buttonRadius, setButtonRadius] = useState(30);
  const [color, setColor] = useState("#3b82f6");
  const [textColor, setTextColor] = useState("#FFFFFF");

  const [fields, setFields] = useState<Field[]>([
    {
      id: "1",
      type: "text",
      label: "Label Text",
      required: false,
      placeholder: "placeholder",
    },
  ]);
  const [columns, setColumns] = useState<string>("1");

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

  const updateField = (id: string, key: string, value: unknown) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
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
  const handeColor = (color: Color) => {
    console.log(color, "color");
    setColor(colorToHex(color));
  };
  const onDragEnd = (result: unknown) => {
    console.log(result, "result");
    const { source, destination }: any = result;
    if (!destination) return;
    if (source.index === destination.index) return;
    const updatedFields = [...fields];
    const temp = updatedFields[source.index];
    updatedFields[source.index] = updatedFields[destination.index];
    updatedFields[destination.index] = temp;
    setFields(updatedFields);
  };
  const generateForm = () => {
    const formData = {
      fields,
      columns: columns,
      buttonAlignment: buttonAlignment,
      buttonText: buttonText,
      buttonRadius: buttonRadius,
      color: color,
      textColor: textColor,
      passwordPattern: passwordPattern ? passwordPattern : null,
    };

    try {
      const existingForms = JSON.parse(
        localStorage.getItem("savedForms") || "[]"
      );
      existingForms.push(formData);
      localStorage.setItem("savedForms", JSON.stringify(existingForms));
      alert("Form saved successfully!");
    } catch (error) {
      console.error("Error saving form to local storage:", error);
    }
  };

  return (
    <div className="text-black">
      <div className="bg-[#D9EAFD] flex items-center justify-center min-h-[15rem]">
        <h1 className="text-[2rem] font-bold">Form Builder</h1>
      </div>
      <div className="p-20">
        <div className="flex gap-10">
          {/* Form Style Section */}
          <div className="basis-1/2">
            {/* <h4 className="text-center font-medium text-xl">Form Style</h4> */}
            <div>
              <div className="w-full flex  gap-3 items-start  ">
                <div>
                  <label
                    htmlFor="single"
                    className=" bg-blue-300 w  text-white px-4 py-2 mb-4"
                    onClick={() => toggleColumnView("single")}
                  >
                    Single Column{" "}
                    <input id="single" type="radio" name="column" />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="multi"
                    className="bg-blue-300 text-white px-4 py-2 mb-4 "
                    onClick={() => toggleColumnView("multicolumn")}
                  >
                    multi Column <input id="multi" type="radio" name="column" />
                  </label>
                </div>
              </div>
            </div>
            <div className="   mt-5 ">
              <div className=" w-full flex gap-2 items-start  ">
                {isMultiColumn.multiColumn && (
                  <Input
                    name="column"
                    type="text"
                    label="Number of columns"
                    placeholder="Enter number of columns"
                    className="mb-4  border-2 border-gray-300 p-2 rounded"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setColumns(e.target.value)
                    }
                  />
                )}

                <div className=" flex gap-4">
                  <Input
                    name="formtitle"
                    placeholder=" Enter Form title"
                    label="Form title"
                    className="mb-4  border-2 border-gray-300 p-2 rounded"
                  />
                  <div className=" flex items-center gap-3">
                    {" "}
                    <Input
                      name="buttonText"
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
                          setColor={handeColor}
                          setTextColor={setTextColor}
                          buttonRadius={buttonRadius}
                          setButtonRadius={setButtonRadius}
                          setButtonAlignment={setButtonAlignment}
                        />
                      </PopoverContent>
                    </Popover>
                    <div className=" relative"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="flex gap-5 items-center bg-gray-50 p-2 rounded shadow mb-4"
                >
                  <div>
                    <label className="capitalize text-base">Field Type</label>

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
                  </div>
                  <Input
                    name="label"
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
                      name="placeholder"
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
                      name="required"
                      type="checkbox"
                      checked={field.required}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                        // setOpenPasswordLength={setOpenPasswordSetting}
                        // passwordLength={passwordLength}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              ))}
              <button
                onClick={addNewField}
                className="bg-blue-500 rounded-md text-white px-4 py-2 mt-4"
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
                                  name="placeholder"
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  required={field.required}
                                  register={register}
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
                  className={`px-4 rounded-[${buttonRadius}%] bg-[${color}] text-[${textColor}] py-3`}
                >
                  {buttonText}
                </button>
              </div>
            </div>
            <div className=" mt-10">
              <button
                onClick={generateForm}
                className=" w-full  bg-blue-500  rounded-md text-white py-3"
              >
                Generate Form
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="  grid grid-cols-2  ">
            {savedForms.map((form, index) => (
              <div key={index} className=" p-4 mb-4 max-h-40 ">
                {" "}
                <PreviewForm form={form} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
