import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../common/FormUI";
import { useTypedDispatch } from "../../../store/hooks";
import { setPasswordPattern } from "../../../store/actions/password";

const PasswordForm = () => {
  const dispatch = useTypedDispatch();
  // Predefined patterns
  const patterns = [
    { id: "alphanumeric", label: "Alphanumeric only", value: "a-zA-Z0-9" },
    { id: "numbers", label: "Numbers only", value: "\\d" },
    { id: "lowercase", label: "Lowercase letters only", value: "a-z" },
    { id: "uppercase", label: "Uppercase letters only", value: "A-Z" },
    {
      id: "alphanumericSpecial",
      label: "Alphanumeric + special characters",
      value: "!@#$%^&*",
    },
  ];

  const [selectedPatterns, setSelectedPatterns] = useState([]); // Store selected patterns
  const [customPatternError, setCustomPatternError] = useState("");

  // Combine selected patterns into a single regex dynamically
  const combinedPattern = selectedPatterns.length
    ? `^[${selectedPatterns.join("")}]+$`
    : undefined;

  // Config with dynamic pattern
  const config = {
    min: 4,
    max: 64,
    defaultMin: 8,
    defaultMax: 16,
    pattern: combinedPattern ? new RegExp(combinedPattern) : undefined,
    patternMessage: "Your input does not match the selected patterns.",
  };

  // const passwordSchema = createPasswordSchema(config);
  // useEffect(() => {
  //   dispatch(setPasswordPattern({ message: "hello" }));
  // }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // console.log(errors);
  const handlePatternChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedPatterns((prev) => [...prev, value]);
    } else {
      setSelectedPatterns((prev) =>
        prev.filter((pattern) => pattern !== value)
      );
    }

    try {
      new RegExp(combinedPattern); // Validate regex
      setCustomPatternError(""); // Clear error if valid
    } catch (err) {
      setCustomPatternError("Invalid regex pattern."); // Show error if invalid
    }
  };

  const onSubmit = (data) => {
    console.log(data, "data");
    dispatch(setPasswordPattern(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h5>Password Settings</h5>

      <div>
        <label>Minimum Password Length</label>
        <input type="number" {...register("minLength")} />
        {errors.minLength && (
          <p className="error">{errors.minLength.message}</p>
        )}
      </div>

      <div>
        <label>Maximum Password Length</label>
        <input type="number" {...register("maxLength")} />
        {errors.maxLength && (
          <p className="error">{errors.maxLength.message}</p>
        )}
      </div>

      <div>
        <h6>Select Password Patterns:</h6>
        {patterns.map((pattern) => (
          <div key={pattern.id}>
            <label>
              <input
                type="checkbox"
                name="pattern"
                value={pattern.value} /*  */
                onChange={handlePatternChange}
              />
              {pattern.label}
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
          {errors.pattern && <p className="error">{errors.pattern.message}</p>}
        </div>
      )}

      <button type="submit" disabled={!!customPatternError}>
        Save Settings
      </button>
    </form>
  );
};

export default PasswordForm;
