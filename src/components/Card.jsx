import styles from "../assets/styles/card.module.css";

export function Card({url, thumbnail, title, views, date, duration}) {
    return (
            <div className={styles.card}>
                <a target="_blank" href={`${url}`} rel="noopener noreferrer">
                    <div>
                        <div>
                            <img className={`${styles.img} ${styles.card}`} src={`${thumbnail}`} alt="Thumbnail"/>
                        </div>
                        <h3 className={styles.title}>{title}</h3>
                        <div>
                            <div>
                                {views} views
                            </div>
                            <div>
                                {date}
                            </div>
                            <div>
                                {duration}
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        
    );
}