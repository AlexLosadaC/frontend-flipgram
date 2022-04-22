import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { db, fb } from "../../firebase/FirebaseInit";

function Post({ postId, user, username, title, imageUrl }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "asc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }
        return () => {
            unsubscribe();
        };
    }, [postId]);
    const postComment = (e) => {
        e.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: fb.firestore.FieldValue.serverTimestamp(),
        });
        setComment("");
    };

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt={username} src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>
            <img className="post__image" src={imageUrl} alt="" />
            <FormControlLabel
                control={<Checkbox icon={<FavoriteBorder />}
                    checkedIcon={<Favorite />}
                    name="checkedH"
                />}
            />
            <h4 className="post__text"><strong>{username}</strong>{title}</h4>
            {
                <div className={comments.length > 0 ? "post__comments" : ""}>
                    {comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))}
                </div>
            }
            {user && (
                <form className="comment__form">
                    <div className="comment__wrapper">
                        <input
                            className="comment__Input"
                            type="text"
                            placeholder="Comenta el Fl!p"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            className="comment__button text__button"
                            disabled={!comment}
                            onClick={postComment}
                            type="submit"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default Post;