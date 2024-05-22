import { useState } from "react";
import styles from "../assets/styles/userSearch.module.css"

export function UserSearch({ idCallback, hideSearch }) {
  const [newName, setNewName] = useState("");

  // Get twitch id for searched username
  async function handleSubmit(e) {
    e.preventDefault();

    // Get streamer's id
    try {
      const response = await fetch(`http://localhost:3000/api/users/${newName}`);
      const responseData = await response.json();
      idCallback(responseData.id);
    }
    catch(error) {
      console.log(error);
    }
    
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
