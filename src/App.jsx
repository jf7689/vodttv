import { useState, useEffect } from "react";
import { UserSearch } from "./components/UserSearch";
import { Grid } from "./components/Grid";
import styles from "./assets/styles/app.module.css"
import connectImg from "./assets/images/twitch_login.png"; 

export default function App() {
  const url = "https://api.twitch.tv/helix"
  const client_id = "33phdwakkutmw0tyvhvenz0a0jhwd6"
  const redirect = "https://vodttv.netlify.app/"

  // Access token
  const [isValid, setIsValid] = useState(false);
  const [token, setToken] = useState(() => {
    const localToken = localStorage.getItem("ACCESS_TOKEN");
    if (localToken === null) {
      return "";
    }
    return JSON.parse(localToken);
  });
  // Streamer
  const [streamerId, setStreamerId] = useState("");
  // Grid props
  const [props, setProps] = useState({
    url: url,
    client_id: client_id,
    token: token,
    streamer_id: ""
  });
  // Hide username search 
  const [hideSearch, setHideSearch] = useState(false);

  async function validateToken() {
    if (token !== "") {
      try {
        const response = await fetch(
          "https://id.twitch.tv/oauth2/validate",
          {
              headers: {
                  "Authorization": `Bearer ${token}`
              }
          }
        );
  
        const responseData = await response.json();
        if (responseData.client_id) {
          setIsValid(true);
          setProps({...props, token: token});
        }
        else if (responseData.status === 401) {
          localStorage.removeItem("ACCESS_TOKEN");
          setToken("");
          storeToken();
        }
      }
      catch(error) {
        console.log(error);
      }
    }
    else {
      setToken("");
      storeToken();
    }
  } 

  function storeToken() {
      // Link auth
      document.getElementById("authorize").setAttribute("href", `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${client_id}&redirect_uri=${redirect}`);

      // Store token
      if (document.location.hash && document.location.hash != "") {
        let parsedHash = new URLSearchParams(window.location.hash.slice(1));
        if (parsedHash.get("access_token")) {
            const access_token = parsedHash.get("access_token");
            setToken(access_token);
            localStorage.setItem("ACCESS_TOKEN", JSON.stringify(access_token));
        }
    }
    else if (document.location.search && document.location.search != "") {
      // Error
      var parsedParams = new URLSearchParams(window.location.search);
      if (parsedParams.get("error_description")) {
          document.getElementById("access_token").textContent = `${parsedParams.get("error")} - Twitch connection required to use site`;
      }
    }
  }

  useEffect(() => {
    validateToken();
  }, [token]);

  function handleIdCallback(streamer_id) {
    setStreamerId(streamer_id);
    setProps({...props, streamer_id: streamer_id})
  }

  function handleSearchCallback(hidden) {
    setHideSearch(hidden);
  }


  return (
    <div>
      <header>
        <div className={styles.headerContainer}>
          <a href="" className={styles.title}>VodTTV</a>
          <UserSearch url={url} client_id={client_id} token={token} idCallback={handleIdCallback} hideSearch={hideSearch} isValid={isValid}/>
        </div>
      </header>

      <div className={styles.errorResponse} id="access_token"></div>

      <div className={`${styles.introContainer} ${streamerId !== "" ? styles.hidden : styles.shown}`}>
        <div className={styles.introContent}>
          <h1 className={styles.introTitle}>VodTTV</h1>
          <p className={styles.introPar}>
            Looking to find Twitch vods easier? VodTTV is here for you. Make your life better with less scrolling.  
          </p>
          <a className={` ${isValid ? styles.hidden : styles.shown}`} href="" id="authorize"> 
            <div>
              <img className={styles.connect} src={connectImg} alt="Connect Twitch"/>
            </div>
          </a>
        </div>

      </div>
  
      <Grid {...(props.streamer_id !== "" && props)} searchCallback={handleSearchCallback}/>
    </div>
  );
}
