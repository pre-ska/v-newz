import React, { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../../firebase";
import LinkItem from "./LinkItem";

function LinkList(props) {
  const [links, setLinks] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  const getLinks = () => {
    firebase.db.collection("links").onSnapshot(handleSnapshot);
  };

  const handleSnapshot = snapshot => {
    const links = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });

    setLinks(links);
  };

  useEffect(() => {
    getLinks();
  }, []);

  return (
    <div>
      {links.map((link, i) => (
        <LinkItem key={link.id} showCount={true} link={link} index={i + 1} />
      ))}
    </div>
  );
}

export default LinkList;
