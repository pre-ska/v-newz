import React, { useState, useEffect, useContext } from "react";
import FirebaseContext from "../../firebase/context";
import LinkItem from "./LinkItem";

function SearchLinks() {
  const { firebase } = useContext(FirebaseContext);

  const [filteredLinks, setFilteredLinks] = useState([]);

  const [links, setLinks] = useState([]);

  const [filter, setFilter] = useState("");

  const getInitialLinks = () => {
    firebase.db
      .collection("links")
      .get()
      .then(snapshot => {
        const links = snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
        setLinks(links);
      });
  };

  useEffect(() => {
    getInitialLinks();
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    const query = filter.toLowerCase();
    const matchedLinks = links.filter(link => {
      return (
        link.description.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query) ||
        link.postedBy.name.toLowerCase().includes(query)
      );
    });
    console.log(matchedLinks);
    setFilteredLinks(matchedLinks);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          search <input type="text" onChange={e => setFilter(e.target.value)} />
          <button>OK</button>
        </div>
      </form>
      {filteredLinks.map((filteredLink, i) => (
        <LinkItem
          key={filteredLink.id}
          link={filteredLink}
          showCount={false}
          index={i}
        />
      ))}
    </div>
  );
}

export default SearchLinks;
