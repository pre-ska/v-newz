import React, { useContext } from "react";
import useFormValidation from "../Auth/useFormValidation";
import validateCreateLink from "../Auth/validateCreateLink";
import FirebaseContext from "../../firebase/context";
import fb from "../../firebase";
const INITIAL_STATE = {
  description: "",
  url: ""
};

function CreateLink(props) {
  const { firebase, user } = useContext(FirebaseContext);

  const handleCreateLink = () => {
    if (!user) props.history.push("/login");
    else {
      const { url, description } = values;

      const newLink = {
        url,
        description,
        postedBy: {
          id: user.uid,
          name: user.displayName
        },
        votes: [],
        comments: [],
        created: Date.now()
      };
      // fb.db.FieldValue.serverTimestamp()
      firebase.db.collection("links").add(newLink);

      props.history.push("/");
    }
  };

  const { handleSubmit, handleChange, values, errors } = useFormValidation(
    INITIAL_STATE,
    validateCreateLink,
    handleCreateLink
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-column mt3">
      <input
        type="text"
        value={values.description}
        onChange={handleChange}
        name="description"
        placeholder="A description of your link"
        autoComplete="nope"
        className={errors.description && "error-input"}
      />

      {errors.description && <p className="error-text">{errors.description}</p>}

      <input
        type="url"
        value={values.url}
        onChange={handleChange}
        name="url"
        placeholder="The url of the link"
        autoComplete="nope"
        className={errors.url && "error-input"}
      />

      {errors.url && <p className="error-text">{errors.url}</p>}

      <button className="button" type="submit">
        Submit
      </button>
    </form>
  );
}

export default CreateLink;
