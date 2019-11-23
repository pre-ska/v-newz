import React, { useContext, useEffect, useState } from "react";
import FirebaseContext from "../../firebase/context";
import LinkItem from "./LinkItem";
import { LINKS_PER_PAGE } from "../../utils";
import axios from "axios";

function LinkList(props) {
  const { firebase } = useContext(FirebaseContext);

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const isNewPage = props.location.pathname.includes("new");
  const isTopPage = props.location.pathname.includes("top");
  const page = Number(props.match.params.page);
  const linksRef = firebase.db.collection("links");

  const handleSnapshot = snapshot => {
    const links = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });

    setLinks(links);

    setLoading(false);
  };

  const getLinks = () => {
    setLoading(true);

    if (isTopPage) {
      return linksRef
        .orderBy("voteCount", "desc")
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } else if (page === 1) {
      return linksRef
        .orderBy("created", "desc")
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } else {
      const offset = page * LINKS_PER_PAGE - LINKS_PER_PAGE;

      axios
        .get(
          `https://us-central1-hacker-news-123.cloudfunctions.net/linksPagination?offset=${offset}`
        )
        .then(response => {
          const links = response.data;
          setLinks(links);
          setLoading(false);
        });

      return () => {};
    }
  };

  useEffect(() => {
    const unsubscribe = getLinks();

    return () => unsubscribe();
  }, [isTopPage, page]);

  const visitPreviousPage = () => {
    if (page > 1) props.history.push(`/new/${page - 1}`);
  };

  const visitNextPage = () => {
    if (LINKS_PER_PAGE / links.length === 1) {
      props.history.push(`/new/${page + 1}`);
    }
  };

  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE + 1 : 0;

  const previous_ = isNewPage && page > 1;

  const next_ = links.length === LINKS_PER_PAGE;

  return (
    <div style={{ opacity: loading ? 0.25 : 1 }}>
      {links.map((link, i) => (
        <LinkItem
          key={link.id}
          showCount={true}
          link={link}
          index={i + pageIndex}
        />
      ))}
      <div className="pagination">
        <button
          disabled={!previous_}
          className="paging-button"
          onClick={visitPreviousPage}
        >
          Previous
        </button>

        <button
          disabled={!next_}
          className="paging-button"
          onClick={visitNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default LinkList;
