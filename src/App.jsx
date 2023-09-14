import { useState, useEffect } from "react";
import { UserSearch } from "./components/UserSearch";
import { Grid } from "./components/Grid";
import styles from "./assets/styles/app.module.css"

export default function App() {
  const url = "https://api.twitch.tv/helix"
  const client_id = "33phdwakkutmw0tyvhvenz0a0jhwd6"
  const redirect = "http://localhost:5173"

  // Access token
  const [isValid, setIsValid] = useState(false);
  const [token, setToken] = useState(() => {
    const localToken = localStorage.getItem("ACCESS_TOKEN");
    if (localToken == null) return "";
    return JSON.parse(localToken);
  });
  // Streamer id
  const [streamerId, setStreamerId] = useState("");
  // Grid props
  const [props, setProps] = useState({
    url: url,
    client_id: client_id,
    token: token,
    streamer_id: ""
  });

  async function validateToken() {
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
      }
      else if (responseData.status === 401) {
        setIsValid(false);
      }
    }
    catch(error) {
      console.log(error);
    }
  } 

  useEffect(() => {
    validateToken();

    if (!isValid) {
      // Get auth
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
        var parsedParams = new URLSearchParams(window.location.search);
        if (parsedParams.get("error_description")) {
            document.getElementById("access_token").textContent = `${parsedParams.get("error")} - authorization required to use site`;
        }
      }
    }
  }, []);

  // check data
  function check() {
    console.log(token);
    console.log(streamerId);
    console.log(props);
  }

  function handleIdCallback(streamer_id) {
    setStreamerId(streamer_id);
    setProps({...props, streamer_id: streamer_id})
  }


  return (
    <>
      <h1>VodTTV</h1>
      <div id="access_token"></div>
      <button className="btn" onClick={check}>Token</button>
      <a className={ isValid ? styles.hidden : styles.shown} href="" id="authorize"> Connect to twitch</a>
      <UserSearch url={url} client_id={client_id} token={token} idCallback={handleIdCallback} />
      <h2>Vods</h2>
      <Grid {...(props.streamer_id !== "" && props)}/>
    </>
  );
}
