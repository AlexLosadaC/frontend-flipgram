import React, { useState } from "react";
import { storage, db, fb } from "../../firebase/FirebaseInit";
import "./ImageUpload.css";

function ImageUpload({ user }) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [title, setTitle] = useState("");
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {

                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (err) => {

                console.log(err);
                alert(err.message);
            },
            () => {

                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then((url) => {

                        db.collection("posts").add({
                            timestamp: fb.firestore.FieldValue.serverTimestamp(),
                            title: title,
                            imageUrl: url,
                            username: user.displayName,
                        });
                        setProgress(0);
                        setTitle("");
                        setImage(null);
                    });
            }
        );
    };

    return (
        <div className="imageUpload">
            <input
                type="text"
                placeholder="Título del Fl!p"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
            <progress className="progress" value={progress} max="100" />
            <div className="uploadCapBtn">
                <input className="uploadCap" type="file" onChange={handleChange} />
                <button className="primary__button uploadBtn" onClick={handleUpload}>
                    Fl!p
                </button>
            </div>
        </div>
    );
}

export default ImageUpload;