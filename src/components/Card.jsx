import styles from "../assets/styles/card.module.css";

export function Card({url, thumbnail, title, views, date, duration}) {
    return (
            <div className={styles.card}>
                <a target="_blank" href={`${url}`} rel="noopener noreferrer">
                    <div>
                        <div className={styles.thumbnailContainer}>
                            <img className={`${styles.thumbnail}`} src={`${thumbnail}`} alt="Thumbnail"/>
                            <div className={styles.durationContainer}>
                                {duration}
                            </div>
                        </div>
                        <h3 className={styles.title}>{title}</h3>
                        <div>
                            <div>
                                {views} views
                            </div>
                            <div>
                                {date}
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        
    );
}