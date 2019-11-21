import React, { useState } from "react";
import useFormValidation from "./useFormValidation";
import validateLogin from "./validateLogin";

const INITIAL_STATE = {
  name: "",
  email: "",
  password: ""
};

function Login(props) {
  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    isSubmitting
  } = useFormValidation(INITIAL_STATE, validateLogin);

  const [login, setLogin] = useState(true);

  return (
    <div>
      <h2 className="mv3">{login ? "Login" : "Create Account"}</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-column"
        autoComplete="nope"
      >
        {!login && (
          <input
            onChange={handleChange}
            value={values.name}
            name="name"
            type="text"
            placeholder="Your name"
            autoComplete="nope"
          />
        )}
        <input
          onChange={handleChange}
          value={values.email}
          onBlur={handleBlur}
          name="email"
          type="email"
          className={errors.email && "error-input"}
          placeholder="Your email"
          autoComplete="nope"
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
        <input
          onChange={handleChange}
          value={values.password}
          onBlur={handleBlur}
          name="password"
          type="password"
          className={errors.password && "error-input"}
          autoComplete="new-password"
          placeholder="Choose a secure password"
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <div className="flex mt3">
          <button
            disabled={isSubmitting}
            type="submit"
            className="button pointer  mr2"
            style={{ background: isSubmitting ? "gray" : "orange" }}
          >
            Submit
          </button>
          <button
            type="button"
            className="pointer button"
            onClick={() => setLogin(prevLogin => !prevLogin)}
          >
            {login ? "need to create an account?" : "already have an acount?"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
