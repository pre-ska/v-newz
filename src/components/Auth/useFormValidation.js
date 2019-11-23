import { useState, useEffect } from "react";

function useFormValidation(initialState, validate, authenticate) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;

      if (noErrors) {
        console.log("use effect no errors");
        authenticate();

        setSubmitting(false);
      } else setSubmitting(false);
    }
  }, [errors]);

  const handleChange = e => {
    e.persist();

    setValues(prevValues => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
  };

  const handleBlur = () => {
    const validationErrors = validate(values);

    setErrors(validationErrors);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const validationErrors = validate(values);

    setErrors(validationErrors);

    setSubmitting(true);
  };

  return {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    isSubmitting
  };
}

export default useFormValidation;
