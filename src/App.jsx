import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { UserSearch } from "./components/UserSearch";
import { Grid } from "./components/Grid";
import { Home } from "./components/Home";
import styles from "./assets/styles/app.module.css";

export default function App() {
  // Streamer
  const [streamerId, setStreamerId] = useState("");
  // Hide username search 
  const [hideSearch, setHideSearch] = useState(false);


  function handleIdCallback(streamer_id) {
    setStreamerId(streamer_id);
  }

  function handleSearchCallback(hidden) {
    setHideSearch(hidden);
  }


  return (
    <div>
      <header>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.title}>VodTTV</Link>
          <UserSearch idCallback={handleIdCallback} hideSearch={hideSearch}/>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/:user" element={<Grid searchCallback={handleSearchCallback}/>} />
      </Routes>
  
      {streamerId && <Grid streamer_id={streamerId} searchCallback={handleSearchCallback}/>}
    </div>
  );
}
