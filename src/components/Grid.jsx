import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "./Card";
import styles from "../assets/styles/grid.module.css";
import liveIcon from "../assets/images/live.png";

export function Grid({url, client_id, token, streamer_id}) {
    const [vods, setVods] = useState([]);
    const [allVods, setAllVods] = useState([]);
    const [filterVods, setFilterVods] = useState([]);
    const [title, setTitle] = useState("");
    const formatter = Intl.NumberFormat("en", { notation: "compact" });
    const observer = useRef(null);

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

                // Initial 30 vods shown
                setVods(responseData.data);

                // Store vods for reference for filtering
                setAllVods(currentVods => {
                    return [...currentVods, ...responseData.data]
                });
                // Default filter is latests vods
                setFilterVods(currentVods => {
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

                    // Store vods for reference for filtering
                    setAllVods(currentVods => {
                        return [...currentVods, ...responseData.data]
                    });
                    // Default filter is latests vods
                    setFilterVods(currentVods => {
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

    function latestVods() {
        setFilterVods(allVods);
    }

    function oldestVods() {
        setFilterVods([...allVods].reverse());
    }

    function reverseFilter() {
        setFilterVods([...filterVods].reverse());
    }

    function popular() {
        setFilterVods([...allVods].sort((a, b) => b.view_count - a.view_count));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setFilterVods(allVods.filter(vod => {
            return vod.title.includes(title);
        }));
    }

    // Load next 30 vods for infinite scroll
    function loadNewCards() {
        // Set range for slice
        let vodStart = vods.length;
        let vodEnd = vods.length + 30;
        if (vodEnd > filterVods.length) {
            vodEnd = filterVods.length;
        }

        // Add vods
        if (vodStart !== vodEnd) {
            setVods(currentVods => {
                return [...currentVods, ...filterVods.slice(vodStart, vodEnd)]
            });
        }
    }

    // Infinite scroll
    const lastCard = useCallback(node => {
        if (!node) return;
        if (observer.current) {
            observer.current.disconnect();
        }
        if (vods.length === filterVods.length ) {
            return;
        }
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadNewCards();
            }
        });

        // Observe new last vod
        observer.current.observe(node);
    }, [loadNewCards])

    
    // Username had been searched
    useEffect(() => {
        // Reset for new search
        setAllVods([]);
        setFilterVods([]);
        setVods([]);

        getVods();
        console.log("Grab Vods");

    }, [streamer_id]);

    // Show first 30 vods after a filter has been applied
    useEffect(() => {
        setVods([...filterVods.slice(0, 30)]);
        console.log("Triggered");
    }, [filterVods])
    

    function checkVods() {
        console.log("All Vods", allVods);
        console.log("Filter Vods", filterVods);
        console.log("Shown Vods", vods);
    }

    return (
        <>
            <button onClick={checkVods}>Vods</button>
            <form onSubmit={handleSubmit} className="title-form">
                <div className="form-row">
                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Search Title"/>
                </div>
            </form>
            <div>
                <button onClick={latestVods}>Latest</button>
                <button onClick={popular}>Popular</button>
                <button onClick={oldestVods}>Oldest</button>
                <button onClick={reverseFilter}>Reverse Order</button>
            </div>
            <div className={styles.grid}>
            {vods.map((vod, i) => {
                // Set thumbnail dimensions for url
                let thumbnail = vod.thumbnail_url;
                thumbnail = thumbnail.replace("%{width}", "666").replace("%{height}", "375");
                if (thumbnail.includes("404/404")) {
                    thumbnail = liveIcon;
                }

                // Create Grid of vods
                return (
                    <div ref={i === vods.length - 1 ? lastCard : null} key={vod.id}>
                        <Card  url={vod.url} thumbnail={thumbnail} title={vod.title} views={formatter.format(vod.view_count)}
                        date={vod.published_at.slice(0,10)} duration={vod.duration}
                        />
                    </div>
                );
            })}
            </div>
        </>
    );
}