import { useState, useEffect } from "react";
import styles from "../assets/grid.module.css";

export function Grid({url, client_id, token, streamer_id}) {
    const [vods, setVods] = useState([]);
    const formatter = Intl.NumberFormat("en", { notation: "compact" });

    
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
        .then(res => {
            setVods(res.data);
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
        <div className={styles.grid}>
        {vods.map(vod => {
            // set thumbnail dimensions for url
            let thumbnail = vod.thumbnail_url;
            thumbnail = thumbnail.replace("%{width}", "320");
            thumbnail = thumbnail.replace("%{height}", "180");
            console.log(thumbnail);

            // Create Grid cards
            return (
                <div className={styles.card}>
                    <a target="_blank" href={`${vod.url}`} rel="noopener noreferrer" key={vod.id}>
                        <div>
                            <div>
                                <img src={`${thumbnail}`} alt="Thumbnail"/>
                            </div>
                            <h3 className={styles.title}>{vod.title}</h3>
                            <div>
                                <div>
                                    {formatter.format(vod.view_count)} views
                                </div>
                                <div>
                                    {vod.published_at.slice(0,10)}
                                </div>
                                <div>
                                    {vod.duration}
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            );
        })}
        </div>
    );
}