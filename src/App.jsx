import { useState, useEffect } from "react";
import { UserSearch } from "./components/UserSearch";
import { Grid } from "./components/Grid";
import styles from "./assets/styles/app.module.css"
import connectImg from "./assets/images/twitch_login.png"; 

export default function App() {
  // Streamer
  const [streamerId, setStreamerId] = useState("");
  // Grid props
  /*const [props, setProps] = useState({
    url: url,
    client_id: client_id,
    token: token,
    streamer_id: ""
  });*/
  // Hide username search 
  const [hideSearch, setHideSearch] = useState(false);


  function handleIdCallback(streamer_id) {
    setStreamerId(streamer_id);
    // setProps({...props, streamer_id: streamer_id})
  }

  function handleSearchCallback(hidden) {
    setHideSearch(hidden);
  }


  return (
    <div>
      <header>
        <div className={styles.headerContainer}>
          <a href="" className={styles.title}>VodTTV</a>
          <UserSearch idCallback={handleIdCallback} hideSearch={hideSearch}/>
        </div>
      </header>

      <div className={`${styles.introContainer} ${streamerId !== "" ? styles.hidden : styles.shown}`}>
        <div className={styles.introContent}>
          <h1 className={styles.introTitle}>VodTTV</h1>
          <p className={styles.introPar}>
            Looking to find Twitch vods easier? VodTTV is here for you. Make your life better with less scrolling.  
          </p>
        </div>
      </div>
  
      {streamerId && <Grid streamer_id={streamerId} searchCallback={handleSearchCallback}/>}
    </div>
  );
}
