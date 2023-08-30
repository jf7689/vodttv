import { useState, useEffect } from "react";

export function Grid({url, client_id, token, streamer_id}) {
    const [vods, setVods] = useState([]);
    
    useEffect(() => {
        // Get vods
        fetch(
            `${url}/videos?user_id=${streamer_id}&type=archive&first=100`,
            {
                method: "GET",
                headers: {
                    "Client-ID": client_id,
                    "Authorization": `Bearer ${token}`
                }
            }
        )
        .then(response => response.json())
        .then(r => {
            setVods(r.data);
        })
        .catch(error => {
            // log issue
            console.log(error);
        });
    }, [streamer_id]);

    function checkVods() {
        console.log(vods);
        console.log(streamer_id);
    }

    return (
        <div>
        {vods.map(vod => {
            return (
                <div>
                    {vod.id}
                </div>
            );
        })}
        </div>
    );
}