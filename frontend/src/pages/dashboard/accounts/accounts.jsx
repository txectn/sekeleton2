import { useState, useEffect, useRef } from "react";
import { useApiQuery } from "../../../hooks/queries/useApiQuery";

import Box from "@mui/material/Box";

import {
    UsersRound,
    UserRoundCheck,
    UserRoundPlus,
    TrendingUp,
    Activity,
    GitBranchPlus,
    CalendarDays,
    ChartNoAxesGantt,
    ShoppingBag,
    ArrowDownUp,
    MoveDownLeft,
    ShoppingBasket,
    ShieldCheck,
    KeyRound,
    UserRound,
    HatGlasses,
    Wifi,
    WifiOff,
    CalendarCheck2,
    Monitor,
    ShieldLock
} from "lucide-react";

import { title, container, errorMessage } from "../dashboardStyle";

import styles from "./accounts.module.css"
import StatCard from "./statCard";
import Skeleton from "@mui/material/Skeleton";

export default function Accounts() {
    const loadingStartTime = useRef(null);

    const [showLoading, setShowLoading] = useState(true);

    const [summaryId, setSummaryId] = useState(1);

    const { data: accountsSummary, isLoading, error, refetch } = useApiQuery({
        path: "/api/account-summary/",
        auth: true,
        params: {
            q: "",
        },
        queryKey: ["accountsSummary", summaryId],
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (isLoading) {
            loadingStartTime.current = Date.now();
            setShowLoading(true);
            return;
        }

        const elapsedTime = Date.now() - loadingStartTime.current;
        const remainingTime = Math.max(0, 1000 - elapsedTime);

        const timer = setTimeout(() => {
            setShowLoading(false);
            loadingStartTime.current = null;
        }, remainingTime);

        return () => clearTimeout(timer);
    }, [isLoading]);

    if (error) {
        return (
            <Box
                sx={container}
            >
                <Box
                    sx={errorMessage}
                >
                    Failed to load data.
                </Box>
            </Box>
        )
    }

    return (
        <Box
            sx={container}
        >
            <div className={`${styles.section}`}>
                {showLoading ?
                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        width="clamp(100px, 45%, 120px)"
                        height={25}
                        sx={{
                            bgcolor: "var(--bg-skeleton-main-70)",
                            borderRadius: "6px",
                        }}
                    /> :
                    <div
                        style={{ ...title, justifyContent: "flex-start" }}
                        className={`${styles.title}`}
                    >
                        Users
                    </div>
                }
                <div className={`${styles.grid}`}>
                    <StatCard
                        stat={"Total Users"}
                        icon={UsersRound}
                        value={`${(accountsSummary?.users?.total_users ? accountsSummary?.users?.total_users / 1000 : 0 / 1000).toFixed(3)}k`}
                        message={"All registered accounts"}
                        chart={TrendingUp}
                        color={"var(--brand-primary)"}
                        isLoading={showLoading}
                    />
                    <StatCard
                        stat={"Active Users"}
                        icon={UserRoundCheck}
                        value={`${(accountsSummary?.users?.active_users ? accountsSummary?.users?.active_users / 1000 : 0 / 1000).toFixed(3)}k`}
                        message={"Currently active accounts"}
                        chart={Activity}
                        color={"var(--bg-inverse)"}
                        isLoading={showLoading}
                    />
                </div>
                <div className={`${styles.grid}`}>
                    <StatCard
                        stat={"New Today"}
                        icon={UserRoundPlus}
                        value={`${(accountsSummary?.users?.new_today ? accountsSummary?.users?.new_today / 1000 : 0 / 1000).toFixed(3)}k`}
                        message={"Registered today"}
                        chart={GitBranchPlus}
                        color={"var(--status-error)"}
                        isLoading={showLoading}
                    />
                    <StatCard
                        stat={"New This Month"}
                        icon={CalendarDays}
                        value={`${(accountsSummary?.users?.new_this_month ? accountsSummary?.users?.new_this_month / 1000 : 0 / 1000).toFixed(3)}k`}
                        message={"Registered this month"}
                        chart={ChartNoAxesGantt}
                        color={"var(--status-success)"}
                        isLoading={showLoading}
                    />
                </div>
            </div>
            <div className={`${styles.section}`}>
                {showLoading ?
                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        width="clamp(100px, 45%, 120px)"
                        height={25}
                        sx={{
                            bgcolor: "var(--bg-skeleton-main-70)",
                            borderRadius: "6px",
                        }}
                    /> :
                    <div
                        style={{ ...title, justifyContent: "flex-start" }}
                        className={`${styles.title}`}
                    >
                        Purchasing
                    </div>
                }
                <div className={`${styles.grid}`}>
                    <StatCard
                        stat={"Customers"}
                        icon={ShoppingBag}
                        value={`${(accountsSummary?.purchasing?.customers ? accountsSummary?.purchasing?.customers / 1000 : 0 / 1000).toFixed(3)}k`}
                        message={"Users who have purchased"}
                        chart={ArrowDownUp}
                        color={"var(--brand-primary)"}
                        isLoading={showLoading}
                    />
                    <StatCard
                        stat={"Never Purchased"}
                        icon={ShoppingBasket}
                        value={`${(accountsSummary?.purchasing?.never_purchased ? accountsSummary?.purchasing?.never_purchased / 1000 : 0 / 1000).toFixed(3)}k`}
                        message={"Users without a purchase"}
                        chart={MoveDownLeft}
                        color={"var(--bg-inverse)"}
                        isLoading={showLoading}
                    />
                </div>
            </div>
            <div className={`${styles.section}`}>
                {showLoading ?
                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        width="clamp(100px, 45%, 120px)"
                        height={25}
                        sx={{
                            bgcolor: "var(--bg-skeleton-main-70)",
                            borderRadius: "6px",
                        }}
                    /> :
                    <div
                        style={{ ...title, justifyContent: "flex-start" }}
                        className={`${styles.title}`}
                    >
                        Presences
                    </div>
                }
                <div className={`${styles.grid}`}>
                    <StatCard
                        stat={"Authenticated"}
                        icon={ShieldCheck}
                        value={`${(accountsSummary?.presences?.authenticated ? accountsSummary?.presences?.authenticated / 1000 : 0 / 1000).toFixed(3)}k`}
                        message={"Recognized user sessions"}
                        chart={KeyRound}
                        color={"var(--status-error)"}
                        isLoading={showLoading}
                    />
                    <StatCard
                        stat={"Anonymous"}
                        icon={UserRound}
                        value={`${(accountsSummary?.presences?.anonymous ? accountsSummary?.presences?.anonymous / 1000 : 0 / 1000).toFixed(3)}k`}
                        message={"Guest sessions"}
                        chart={HatGlasses}
                        color={"var(--status-success)"}
                        isLoading={showLoading}
                    />
                </div>
                <div className={`${styles.grid}`}>
                    <StatCard
                        stat={"Active Now"}
                        icon={Wifi}
                        value={`${(accountsSummary?.presences?.active_now ? accountsSummary?.presences?.active_now / 1000 : 0 / 1000).toFixed(3)}k`}
                        message={"Currently online sessions"}
                        chart={Activity}
                        color={"var(--brand-primary)"}
                        isLoading={showLoading}
                    />
                    <StatCard
                        stat={"Offline Now"}
                        icon={WifiOff}
                        value={`${(accountsSummary?.presences?.offline_now ? accountsSummary?.presences?.offline_now / 1000 : 0 / 1000).toFixed(3)}k`}
                        message={"Currently inactive sessions"}
                        chart={Activity}
                        color={"var(--bg-inverse)"}
                        isLoading={showLoading}
                    />
                </div>
                <div className={`${styles.grid}`}>
                    <StatCard
                        stat={"Active Today"}
                        icon={CalendarCheck2}
                        value={`${(accountsSummary?.presences?.active_today ? accountsSummary?.presences?.active_today / 1000 : 0 / 1000).toFixed(3)}k`}
                        message={"Sessions active today"}
                        chart={Activity}
                        color={"var(--status-error)"}
                        isLoading={showLoading}
                    />
                    <StatCard
                        stat={"Unique Devices Today"}
                        icon={Monitor}
                        value={`${(accountsSummary?.presences?.unique_devices_today ? accountsSummary?.presences?.unique_devices_today / 1000 : 0 / 1000).toFixed(3)}k`}
                        message={"Distinct devices seen today"}
                        chart={Activity}
                        color={"var(--status-success)"}
                        isLoading={showLoading}
                    />
                </div>
            </div>
            <div className={`${styles.section}`}>
                {showLoading ?
                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        width="clamp(100px, 45%, 120px)"
                        height={25}
                        sx={{
                            bgcolor: "var(--bg-skeleton-main-70)",
                            borderRadius: "6px",
                        }}
                    /> :
                    <div
                        style={{ ...title, justifyContent: "flex-start" }}
                        className={`${styles.title}`}
                    >
                        Authentication
                    </div>
                }
                <div className={`${styles.grid}`}>
                    <StatCard
                        stat={"Successful Logins"}
                        icon={ShoppingBag}
                        value={`${(accountsSummary?.authentication?.successful_logins_today ? accountsSummary?.authentication?.successful_logins_today / 1000 : 0 / 1000).toFixed(3)}k`}
                        message={"Successful logins today"}
                        chart={ArrowDownUp}
                        color={"var(--brand-primary)"}
                        isLoading={showLoading}
                    />
                    <StatCard
                        stat={"Failed Logins"}
                        icon={ShieldLock}
                        value={`${(accountsSummary?.authentication?.failed_logins_today ? accountsSummary?.authentication?.failed_logins_today / 1000 : 0 / 1000).toFixed(3)}k`}
                        message={"Failed attempts today"}
                        chart={MoveDownLeft}
                        color={"var(--bg-inverse)"}
                        isLoading={showLoading}
                    />
                </div>
            </div>
        </Box>
    )
}