import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../common/FormUI";
import { useTypedDispatch } from "../../../store/hooks";
import { setPasswordPattern } from "../../../store/actions/password";

interface Pattern {
  id?: string;
  label?: string;
  value: string;
}

interface FormData {
  minLength: number;
  maxLength: number;
  pattern: string;
}

const PasswordForm: React.FC = () => {
  const dispatch = useTypedDispatch();

  // Predefined patterns
  const patterns: Pattern[] = [
    { id: "alphanumeric", label: "Alphanumeric ", value: "a-zA-Z0-9" },
    { id: "numbers", label: "Numbers ", value: "\\d" },
    { id: "lowercase", label: "Lowercase letters", value: "a-z" },
    { id: "uppercase", label: "Uppercase letters ", value: "A-Z" },
    {
      id: "alphanumericSpecial",
      label: "Alphanumeric + special characters",
      value: "!@#$%^&*",
    },
  ];

  const [selectedPatterns, setSelectedPatterns] = useState<Pattern[]>([]);
  const [customPatternError, setCustomPatternError] = useState<string>("");

  // Combine selected patterns into a single regex dynamically
  const combinedPattern: any = selectedPatterns.length
    ? `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?:[a-zA-Z0-9${selectedPatterns.map(
        (pattern) => pattern.value
      )}]+)$`
    : undefined;

  console.log(combinedPattern, "combinedPattern");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onBlur",
    criteriaMode: "all",
  });

  // Handle Pattern Change
  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked, dataset } = e.target;

    const pattern: Pattern = { value, label: dataset.label };

    if (checked) {
      setSelectedPatterns((prev) => [...prev, pattern]);
    } else {
      setSelectedPatterns((prev) =>
        prev.filter((p) => p.value !== pattern.value)
      );
    }

    try {
      new RegExp(combinedPattern); // Validate regex
      setCustomPatternError("");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setCustomPatternError("Invalid regex pattern.");
    }
  };

  const onSubmit = (data: FormData) => {
    // Pass label + value of selected patterns
    const payload: any = {
      ...data,
      message: selectedPatterns.map((pattern) => pattern.label).join(", "),
      combinedPattern: combinedPattern || undefined, // Explicitly handle undefined
    };

    dispatch(setPasswordPattern(payload));
  };

  return (
    <div className=" p-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5>Password Settings</h5>

        <div className=" flex flex-col">
          <label>Minimum Password Length</label>
          <input
            type="number"
            {...register("minLength")}
            className="mb-4  border-2 border-gray-300 p-2 rounded"
          />
          {errors.minLength && (
            <p className="error">{errors.minLength.message}</p>
          )}
        </div>

        <div className=" flex flex-col">
          <label>Maximum Password Length</label>
          <input
            type="number"
            {...register("maxLength")}
            className="mb-4  border-2 border-gray-300 p-2 rounded"
          />
          {errors.maxLength && (
            <p className="error">{errors.maxLength.message}</p>
          )}
        </div>

        <div>
          <h6>Select Password Patterns:</h6>
          {patterns.map((pattern) => (
            <div key={pattern.id} className=" flex flex-col  gap-5 my-5">
              <label>
                <input
                  type="checkbox"
                  name="pattern"
                  value={pattern.value}
                  data-label={pattern.label} // Send the label using dataset
                  onChange={handlePatternChange}
                />
                <span className=" ml-2"> {pattern.label}</span>
              </label>
            </div>
          ))}
        </div>

        {customPatternError && <p className="error">{customPatternError}</p>}

        {combinedPattern && (
          <div>
            <label>Combined Password Pattern</label>
            <Input
              type="text"
              {...register("pattern")}
              readOnly
              value={combinedPattern}
            />
            {errors.pattern && (
              <p className="error">{errors.pattern.message}</p>
            )}
          </div>
        )}

        {selectedPatterns.length > 0 && (
          <div>
            <h6>Selected Patterns:</h6>
            <ul>
              {selectedPatterns.map((pattern, index) => (
                <li key={index}>
                  {pattern.label} ({pattern.value})
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className=" bg-blue-500 text-white rounded-md  mt-2 p-1"
          disabled={!!customPatternError}
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default PasswordForm;
