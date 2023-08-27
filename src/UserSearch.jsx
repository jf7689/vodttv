import { useState } from "react"

export function UserSearch() {
    const [newName, setNewName] = useState("")
    
    function handleSubmit(e) {
        e.preventDefault()
    
        /* fetch(
            "https://api.twitch.tv/helix/users?id=" + twitch_id,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Client-ID": client_id
                }
            }
        )
        .then(response => response.json())
        .then(response => {

        })
        .catch(error => {
            // log issue
            console.log(error);
        });
        */
    
        //setNewName("")
    }

    return (
        <>
            <a href="https://id.twitch.tv/oauth2/authorize
            ?response_type=token
            &client_id=33phdwakkutmw0tyvhvenz0a0jhwd6
            &redirect_uri=http://localhost:5173">Connect to twitch</a>
            <form onSubmit={handleSubmit} className="streamer-form">
            <div className="form-row">
            <input value={newName} onChange={e => setNewName(e.target.value)} type="text" id="user-search" placeholder="Twitch Username" />
            </div>
            <button className="btn">Search</button>
            </form>
        </>
    )
}