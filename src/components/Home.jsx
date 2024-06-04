import styles from "../assets/styles/home.module.css";

export function Home() {
    return (
        <div className={styles.introContainer}>
        <div className={styles.introContent}>
          <h1 className={styles.introTitle}>VodTTV</h1>
          <p className={styles.introPar}>
            Looking to find Twitch vods easier? VodTTV is here for you. Makes your life better by providing more filtering options.  
          </p>
        </div>
      </div>
    );
}