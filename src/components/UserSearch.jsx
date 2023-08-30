import { useState } from "react";

export function UserSearch({url, client_id, token, idCallback}) {
  const [newName, setNewName] = useState("");

  // Get twitch id for searched username
  function handleSubmit(e) {
    e.preventDefault();
    //console.log(client_id);
    //console.log(token);

    fetch(
      // Get streamer's id
      `${url}/users?login=${newName}`,   
      {
        method: "GET",
        headers: {            
          "Client-ID": client_id,                
          "Authorization": `Bearer ${token}`           
        }
      }
    )
    .then(response => response.json())
    .then(res => {
        idCallback(res.data[0]["id"]);
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
