import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "./Card";
import styles from "../assets/styles/grid.module.css";
import liveIcon from "../assets/images/live.png";

export function Grid({ searchCallback }) {
    const [vods, setVods] = useState([]);
    const [allVods, setAllVods] = useState([]);
    const [filterVods, setFilterVods] = useState([]);
    const [title, setTitle] = useState("");
    const [allYears, setAllYears] = useState([]);
    const [year, setYear] = useState("Year");
    const [month, setMonth] = useState("Month");
    const [isLoaded, setIsLoaded] = useState(false);
    const formatter = Intl.NumberFormat("en", { notation: "compact" });
    const observer = useRef(null);
    const { user } = useParams();
    const navigate = useNavigate();

    // Get vods
    async function getVods() {
        setIsLoaded(false);
        searchCallback(true);
        let streamerId;

        try {
            // Get id of user
            const response = await fetch(`https://vodttvapi.vercel.app/api/users/${user}`);
            const responseData = await response.json();
            // User doesn't exist
            if (responseData.msg) {
                navigate("/error");
                return;
            }
            streamerId = responseData.id;
        }
        catch(error) {
            console.log(error);
        }

        try {
            // Get first page of vods
            const response = await fetch(`https://vodttvapi.vercel.app/api/users/vods/${streamerId}`);
            const responseData = await response.json();

            // Store vods for reference for filtering
            setAllVods(responseData);
            // Default filter is latests vods
            setFilterVods(responseData);
        }
        catch(error) {
            console.log(error);
        }

        // Show first 30 vods
        setVods([...allVods].slice(0, 30));

        return true;
        
    }

    // Check all vods have been loaded
    async function vodsLoaded() {
        const isLoaded = await getVods();
        searchCallback(false);
        if (isLoaded) {
            setIsLoaded(true);
        }
    }

    // Show vods descending from latest
    function latestVods() {
        setFilterVods(allVods);
    }

    // Show vods descending from oldest  
    function oldestVods() {
        setFilterVods([...allVods].reverse());
    }

    // Reverse order of shown vods for any filtering
    function reverseFilter() {
        setFilterVods([...filterVods].reverse());
    }

    // Show vods descending from most views
    function popular() {
        setFilterVods([...allVods].sort((a, b) => b.view_count - a.view_count));
    }

    // Search vod titles for substring
    function handleTitleSearch(e) {
        e.preventDefault();
        setFilterVods(allVods.filter(vod => {
            return vod.title.includes(title);
        }));
        setTitle("");
    }

    // Get years for dropdown
    function getYears() {
        setAllYears([...new Set(allVods.map(vod => vod.published_at.slice(0,4)))]);
        const modal = document.getElementById("dateFilter");
        modal.showModal();
    }

    // Change year dropdown to new selection
    function handleSetYear(e) {
        setYear(e.target.value);
    }

    function handleSetMonth(e) {
        setMonth(e.target.value);
    }

    // Show vods from specified year and/or month
    function dateFilter() {
        if (year !== "Year" && month !== "Month")
        {
            setFilterVods(allVods.filter(vod => {
                return vod.published_at.slice(0,7).includes(`${year}-${month}`);
            }));
        }
        else if (year !== "Year") {
            setFilterVods(allVods.filter(vod => {
                return vod.published_at.slice(0,4).includes(year);
            }));
        }
        else if (month !== "Month") {
            setFilterVods(allVods.filter(vod => {
                return vod.published_at.slice(5,7).includes(month);
            }));
        }

        closeFilterModal();
    }

    function closeFilterModal() {
        const modal = document.getElementById("dateFilter");
        modal.close();
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

        vodsLoaded();
    }, [user]);

    // Show first 30 vods after a filter has been applied
    useEffect(() => {
        setVods([...filterVods.slice(0, 30)]);
    }, [filterVods])

    return (
        <>
            <div className={!isLoaded ? styles.shown : styles.hidden}>
                <div className={styles.loadContainer}>
                    <h2>...Loading All Vods</h2>
                </div>
            </div>

            <div className={isLoaded ? styles.shown: styles.hidden} id="FilterSection">
                <form onSubmit={handleTitleSearch}>
                    <div>
                        <input className={styles.titleSearch} value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Search Title"/>
                    </div>
                </form>
                <dialog className={styles.dialog} id="dateFilter">
                    <div className={styles.dropdownContainer}>
                        <select value={year} onChange={handleSetYear}>
                            <option value="Year">Year</option>
                            {allYears.map(yearOption => {
                                return (
                                <option key={yearOption} value={yearOption}>{yearOption}</option>
                                );
                            })}
                        </select>
                        <select value={month} onChange={handleSetMonth}>
                            <option value="Month">Month</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>
                    <div className={styles.btnFilterContainer}>
                        <button className={styles.dialogBtn} onClick={dateFilter}>Filter</button>
                        <button className={styles.dialogBtn} onClick={closeFilterModal}>Close</button>
                    </div>
                </dialog>
                <div>
                    <button className={styles.btn} onClick={latestVods}>Latest</button>
                    <button className={styles.btn} onClick={popular}>Popular</button>
                    <button className={styles.btn} onClick={oldestVods}>Oldest</button>
                    <button className={styles.btn} onClick={getYears}>Date Filters</button>
                    <button className={styles.btn} onClick={reverseFilter}>Reverse Order</button>
                </div>
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