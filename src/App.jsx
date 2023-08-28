import { useState, useEffect } from "react";
import { UserSearch } from "./components/UserSearch";

export default function App() {
  const client_id = "33phdwakkutmw0tyvhvenz0a0jhwd6"
  const redirect = "http://localhost:5173"
  const [token, setToken] = useState(() => {
    const localToken = localStorage.getItem("ACCESS_TOKEN");
    if (localToken == null) return "";
    return JSON.parse(localToken);
  })

  useEffect(() => {
    document.getElementById("authorize").setAttribute("href", `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${client_id}&redirect_uri=${redirect}`);

    if (document.location.hash && document.location.hash != '') {
        let parsedHash = new URLSearchParams(window.location.hash.slice(1));
        if (parsedHash.get('access_token')) {
            const access_token = parsedHash.get('access_token');
            document.getElementById('access_token').textContent = `Access token ${access_token}`;
            setToken(access_token);
            localStorage.setItem("ACCESS_TOKEN", JSON.stringify(access_token));
        }
    }
    else if (document.location.search && document.location.search != '') {
      var parsedParams = new URLSearchParams(window.location.search);
      if (parsedParams.get('error_description')) {
          document.getElementById('access_token').textContent = `${parsedParams.get('error')} - ${parsedParams.get('error_description')}`;
      }
  }
  });

  return (
    <>
      <h1>VodTTV</h1>
      <div id="access_token"></div>
      <a href="" id="authorize"> Connect to twitch</a>
      <UserSearch client_id={client_id} token={token} />
      <h2>Vods</h2>
      <button className="btn">Token</button>
    </>
  );
}
