import { useState } from "react";

export function UserSearch({url, client_id, token, idCallback}) {
  const [newName, setNewName] = useState("");

  // Get twitch id for searched username
  async function handleSubmit(e) {
    e.preventDefault();
    //console.log(client_id);
    //console.log(token);

    // Get streamer's id
    try {
      const response = await fetch(
        `${url}/users?login=${newName}`,   
        {
          method: "GET",
          headers: {            
            "Client-ID": client_id,                
            "Authorization": `Bearer ${token}`           
          }
        }
      );
      const responseData = await response.json();
      idCallback(responseData.data[0]["id"]);
    }
    catch(error) {
      console.log(error);
    }
    
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
