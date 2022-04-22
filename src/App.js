import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logo.png';

import Post from './components/post/Post';
import { db, auth } from './firebase/FirebaseInit';
import Avatar from '@material-ui/core/Avatar';
import Search from './components/search/Search'
import { makeStyles } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import ImageUpload from "./components/imageUpload/ImageUpload";


function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles(() => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: "#2f2f2f",
    boxShadow: 24,
    padding: "30px 60px",
    borderRadius: "12px",
  },
}));

function App() {

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {

        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {

        } else {
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, username]);


  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, [user, username]);

  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err.message));
    setOpenSignup(false);
    setUsername("");
    setEmail("");
    setPassword("");
  };
  const login = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));
    setOpenLogin(false);
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  return (
    <div className="app">
      <Modal open={openSignup} onclose={() => setOpenSignup(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="app__logo" src={logo} alt="logo" />
          </center>
          <form className="app__signUp">
            <input placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="Email address" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="primary__button" type="submit" onClick={signUp}> Sign up </button>
          </form>
          <center className="authFooter">
            <small>
              &copy; 2021 Fl!pgram by{"AlexLosadaC"}
              <a href="mailto:alexlosada1992@gmail.com">AlexLosadaC</a>
            </small>
          </center>
        </div>
      </Modal>
      <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="app__logo" src={logo} alt="logo" />
          </center>
          <form className="app__signUp">
            <input
              placeholder="Email address"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="primary__button" type="submit" onClick={login}>
              Log in
            </button>
          </form>
          <center className="authFooter">
            <small>
              &copy; 2021 Fl!pgram by{"AlexLosadaC"}
              <a href="mailto:alexlosada1992@gmail.com">AlexLosadaC</a>
            </small>
          </center>
        </div>
      </Modal>
      <div className="app__header">
        <div className="app__headerWrapper">
          <img className="app__logo" src={logo} alt="logo" />
          <div className="search__bar">
            <Search />
          </div>
          {user ? (<div className="log__avatar">
            <button className="secondary__button" onClick={() => auth.signOut()}>
              Logout
            </button>
            <Avatar alt={user.displayName}
              src="/static/images/avatar/1.jpg" />
          </div>
          ) : (
            <div className="app__headerButtons">
              <button
                className="primary__button"
                onClick={() => setOpenLogin(true) || setOpenSignup(false)}
              >
                Log in
              </button>
              <button
                className="third__button"
                onClick={() => setOpenSignup(true) || setOpenLogin(false)}
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="timeline">
        {user && <ImageUpload user={user} />}
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user}
            username={post.username}
            title={post.title}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
export default App;
