import { useState, useEffect } from "react";
import { Card } from "./Card";
import styles from "../assets/styles/grid.module.css";
import liveIcon from "../assets/images/live.png";

export function Grid({url, client_id, token, streamer_id}) {
    const [vods, setVods] = useState([]);
    const [allVods, setAllVods] = useState([]);
    const [vodStart, setVodStart] = useState(0);
    const [vodEnd, setVodEnd] = useState(30);
    const formatter = Intl.NumberFormat("en", { notation: "compact" });
    let throttleTimer;

    // Get vods
    async function getVods() {
        let cursor = "";
        let paginationObj = {};
        
        if (streamer_id !== undefined) {
            try {
                // Get first page of vods
                const response = await fetch(
                    `${url}/videos?user_id=${streamer_id}&type=archive&first=30`,
                    {
                        method: "GET",
                        headers: {
                            "Client-ID": client_id,
                            "Authorization": `Bearer ${token}`
                        }
                    }
                )
                const responseData = await response.json();

                // Store vods
                setVods(responseData.data);
                setAllVods(currentVods => {
                    return [...currentVods, ...responseData.data]
                });
                
                // Check for next page of vods
                paginationObj = responseData.pagination;
                if (Object.keys(paginationObj).length !== 0) {
                    cursor = paginationObj.cursor;
                }
            }
            catch(error) {
                console.log(error);
            }

            // loop for rest of vods if they exist
            while (Object.keys(paginationObj).length !== 0) {
                console.log(cursor);
                try {
                    const response = await fetch(
                        `${url}/videos?user_id=${streamer_id}&type=archive&first=100&after=${cursor}`,
                        {
                            method: "GET",
                            headers: {
                                "Client-ID": client_id,
                                "Authorization": `Bearer ${token}`
                            }
                        }
                    )
                    const responseData = await response.json();

                    // Store vods
                    setAllVods(currentVods => {
                        return [...currentVods, ...responseData.data]
                    });

                    // Check for next page of vods
                    paginationObj = responseData.pagination;
                    if (Object.keys(paginationObj).length !== 0) {
                        cursor = paginationObj.cursor;
                    }                  
                }
                catch(error) {
                    console.log(error);
                }
            }
        }
    }

    function loadNewCards() {
        setVodStart(vodEnd);
        setVodEnd(vodStart + 30);
        setVods(currentVods => {
            return [...currentVods, ...allVods.slice(vodStart, vodEnd)]
        });
        console.log(vodStart);
        console.log(vodEnd);
    }
    
    // Username had been searched
    useEffect(() => {
        getVods();
        console.log("Grab Vods");

    }, [streamer_id]);

    /*useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const lastCard = entries[0];
            if (!lastCard.isIntersecting) return;
            loadNewCards();
            observer.unobserve(lastCard.target);
            observer.observe(vods[vods.length - 1])
        }, {
            rootMargin: "100px"
        });
    
        observer.observe(vods[vods.length - 1]);
        console.log("Load vods");

    }, [vods]);*/

    function checkVods() {
        console.log(allVods);
        console.log(vods);
    }

    return (
        <div className={styles.grid}>
        <button onClick={checkVods}>Vods</button>
        {
            
        }
        {vods.map(vod => {
            // set thumbnail dimensions for url
            let thumbnail = vod.thumbnail_url;
            thumbnail = thumbnail.replace("%{width}", "666").replace("%{height}", "375");
            if (thumbnail.includes("404/404")) {
                thumbnail = liveIcon;
            }

            // Create Grid cards
            return (
                <Card key={vod.id} url={vod.url} thumbnail={thumbnail} title={vod.title} views={formatter.format(vod.view_count)}
                date={vod.published_at.slice(0,10)} duration={vod.duration}
                />
            );
        })}
        </div>
    );
}