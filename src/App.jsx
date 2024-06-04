import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { UserSearch } from "./components/UserSearch";
import { Grid } from "./components/Grid";
import { Home } from "./components/Home";
import { NotFound } from "./components/NotFound";
import styles from "./assets/styles/app.module.css";

export default function App() {
  // Hide username search 
  const [hideSearch, setHideSearch] = useState(false);

  function handleSearchCallback(hidden) {
    setHideSearch(hidden);
  }


  return (
    <div>
      <header>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.title}>VodTTV</Link>
          <UserSearch hideSearch={hideSearch}/>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/:user" element={<Grid searchCallback={handleSearchCallback}/>} />
        <Route path="/error" element={<NotFound />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
