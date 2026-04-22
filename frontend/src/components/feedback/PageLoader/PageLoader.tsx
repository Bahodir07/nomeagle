import React from "react";
import styles from "./PageLoader.module.css";

interface PageLoaderProps {
    text?: string;
    variant?: "default" | "inverted";
}

export const PageLoader: React.FC<PageLoaderProps> = ({
    text = "Loading...",
    variant = "default",
}) => (
    <div className={`${styles.root} ${styles[variant]}`}>
        <div className={styles.spinner} />
        <span className={styles.text}>{text}</span>
    </div>
);
