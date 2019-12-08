import React, { useEffect, useContext, useState } from "react";
import FirebaseContext from "../../firebase/context";
import LinkItem from "./LinkItem";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

function LinkDetail(props) {
  const [link, setLink] = useState(null);
  const { firebase, user } = useContext(FirebaseContext);
  const [commentText, setCommentText] = useState("");

  const linkId = props.match.params.linkId;
  const linkRef = firebase.db.collection("links").doc(linkId);

  useEffect(() => {
    const unsubscribe = getLink();
    return () => unsubscribe();
  }, []);

  const getLink = () => {
    return linkRef.onSnapshot(snapshot => {
      const link = snapshot.data();
      setLink(link);
    });
  };

  const handleAddComment = () => {
    if (!user) props.history.push("/login");
    else if (commentText !== "") {
      linkRef.get().then(doc => {
        if (doc.exists) {
          const previousComments = doc.data().comments;

          const comment = {
            postedBy: {
              id: user.uid,
              name: user.displayName
            },
            created: Date.now(),
            text: commentText
          };

          const updatedComments = [...previousComments, comment];

          linkRef.update({ comments: updatedComments });

          setLink(previousState => ({
            ...previousState,
            comments: updatedComments
          }));

          setCommentText("");
        }
      });
    }
  };

  return !link ? (
    <div>Loading...</div>
  ) : (
    <div>
      <LinkItem showCount={false} link={link} />
      <textarea
        onChange={e => setCommentText(e.target.value)}
        value={commentText}
        cols="60"
        rows="6"
      />

      <div>
        <button className="button" onClick={handleAddComment}>
          Add comment
        </button>
      </div>

      {link.comments.map((comment, i) => (
        <div key={i}>
          <p className="comment-author">
            {comment.postedBy.name} | {distanceInWordsToNow(comment.created)}
          </p>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
}

export default LinkDetail;
