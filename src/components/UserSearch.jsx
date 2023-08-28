import { useState } from "react";

export function UserSearch({client_id, token}) {
  const [newName, setNewName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log(client_id);
    console.log(token);

    fetch(
        `https://api.twitch.tv/helix/users?login=${newName}`,
        {
            method: "GET",
            headers: {
                "Client-ID": client_id,
                "Authorization": `Bearer ${token}`
            }
        }
    )
    .then(response => response.json())
    .then(response => {
        console.log(response)
    })
    .catch(error => {
        // log issue
        console.log(error);
    });
    

    //setNewName("")
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="streamer-form">
        <div className="form-row">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} type="text" id="user-search" placeholder="Twitch Username"/>
        </div>
        <button className="btn">Search</button>
      </form>
    </>
  );
}
