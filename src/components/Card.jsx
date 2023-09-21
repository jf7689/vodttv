import styles from "../assets/styles/card.module.css";

export function Card({url, thumbnail, title, views, date, duration}) {
    return (
            <div className={styles.cardContainer}>
                <a className={styles.card} target="_blank" href={`${url}`} rel="noopener noreferrer">
                    <div className={styles.contentContainer}>
                        <div className={styles.thumbnailContainer}>
                            <img className={styles.thumbnail} src={thumbnail} alt="Thumbnail"/>
                            <div className={styles.durationContainer}>
                                {duration}
                            </div>
                        </div>
                        <h3 className={styles.title}>{title}</h3>
                        <div className={styles.infoContainer}>
                            <div className={styles.infoItem}>
                                {views} views
                            </div>
                            <div className={styles.infoItem}>
                                {date}
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        
    );
}