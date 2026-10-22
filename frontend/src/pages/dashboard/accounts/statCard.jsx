import Skeleton from "@mui/material/Skeleton";

import styles from "./statCard.module.css";

export default function StatCard({
    stat,
    icon: Icon,
    value,
    message,
    chart: Chart,
    color = "var(--status-success)",
    isLoading = false,
}) {
    if (isLoading) {
        return (
            <article
                style={{
                    padding: "1.5rem",
                }}
                className={styles.card}
            >
                {/* Header */}
                <div className={styles.header}>
                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        width="clamp(100px, 45%, 180px)"
                        height={18}
                        sx={{
                            bgcolor: "var(--bg-skeleton-main-70)",
                            borderRadius: "6px",
                        }}
                    />

                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        width={40}
                        height={40}
                        sx={{
                            bgcolor: "var(--bg-skeleton-main-70)",
                            borderRadius: "10px",
                            flexShrink: 0,
                        }}
                    />
                </div>

                {/* Value and chart */}
                <div className={styles.content}>
                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        width="90px"
                        height={32}
                        sx={{
                            bgcolor: "var(--bg-skeleton-main)",
                            borderRadius: "6px",
                        }}
                    />

                    {Chart && (
                        <Skeleton
                            variant="rounded"
                            animation="wave"
                            width={64}
                            height={64}
                            sx={{
                                bgcolor: "var(--bg-skeleton-main-70)",
                                borderRadius: "12px",
                                flexShrink: 0,
                            }}
                        />
                    )}
                </div>

                {/* Message */}
                {message && (
                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        width="75%"
                        height={14}
                        sx={{
                            bgcolor: "var(--bg-skeleton-main-70)",
                            borderRadius: "5px",
                            mt: 1,
                        }}
                    />
                )}
            </article>
        );
    }

    return (
        <article className={styles.card}>
            <div className={styles.header}>
                <span className={styles.stat}>{stat}</span>

                {Icon && (
                    <span className={styles.icon}>
                        <Icon size={21} color={color} />
                    </span>
                )}
            </div>

            <div className={styles.content}>
                <h2 className={styles.value}>{value}</h2>

                {Chart && (
                    <div className={styles.chart} aria-hidden="true">
                        <Chart
                            size={55}
                            color={color}
                            strokeWidth={1.8}
                        />
                    </div>
                )}
            </div>

            {message && (
                <p className={styles.message}>{message}</p>
            )}
        </article>
    );
}