import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/styles/userSearch.module.css"

export function UserSearch({ idCallback, hideSearch }) {
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();

  // Get twitch id for searched username
  async function handleSubmit(e) {
    e.preventDefault();
    // Go to route for the searched name
    navigate(`/${newName}`);

    // Clear search bar
    setNewName("");
  }

  if (!hideSearch) {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div>
            <input className={styles.userSearch} value={newName} onChange={(e) => setNewName(e.target.value)} type="text" id="user-search" placeholder="Twitch Username"/>
          </div>
        </form>
      </>
    );
  }
}
