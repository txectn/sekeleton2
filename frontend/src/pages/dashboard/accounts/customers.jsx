// import { useEffect, useState, useRef } from "react";
// import { keepPreviousData } from "@tanstack/react-query";

// import { useApiQuery } from "../../../hooks/queries/useApiQuery";
// import { BASE_URL } from "../../../config";

// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import CircularProgress from "@mui/material/CircularProgress";
// import Chip from "@mui/material/Chip";
// import Skeleton from "@mui/material/Skeleton";
// import { DataGrid } from "@mui/x-data-grid";

// import GlobalStyles from "@mui/material/GlobalStyles";

// import { title, container, errorMessage } from "../dashboardStyle";

// const PAGE_SIZE = 10;

// const tableStyle = {
//     color: "var(--text-main)",
//     fontSize: "var(--fs-sm)",
//     fontWeight: "var(--fw-semibold)",
// };

// const formatDate = (value) => {
//     if (!value) return "Never";

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) return "Never";

//     return new Intl.DateTimeFormat("en-GB", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//     }).format(date);
// };

// const formatMoney = (value) => {
//     const amount = Number(value);

//     if (!Number.isFinite(amount)) return "৳0.00";

//     return `৳${amount.toLocaleString("en-BD", {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//     })}`;
// };

// const columns = [
//     {
//         field: "id",
//         headerName: "ID",
//         width: 80,
//     },
//     {
//         field: "name",
//         headerName: "Name",
//         minWidth: 150,
//         flex: 1,
//     },
//     {
//         field: "email",
//         headerName: "Email",
//         minWidth: 220,
//         flex: 1.5,
//     },
//     {
//         field: "phone",
//         headerName: "Phone",
//         minWidth: 140,
//         flex: 1,
//         valueFormatter: (value) => value || "—",
//     },
//     {
//         field: "status",
//         headerName: "Status",
//         minWidth: 120,
//         renderCell: (params) => {
//             const active = params.value === "active";

//             return (
//                 <Chip
//                     label={params.value || "Unknown"}
//                     size="small"
//                     color={active ? "success" : "default"}
//                     variant="outlined"
//                     sx={{
//                         color: "var(--text-main)",
//                         fontSize: "var(--fs-sm)",
//                         fontWeight: "var(--fw-semibold)",
//                         px: 1.5,
//                         py: 1.5,
//                     }}
//                 />
//             );
//         },
//     },
//     {
//         field: "orders_count",
//         headerName: "Orders",
//         type: "number",
//         width: 100,
//     },
//     {
//         field: "total_spent",
//         headerName: "Total Spent",
//         minWidth: 140,
//         valueFormatter: (value) => formatMoney(value),
//     },
//     {
//         field: "joined_at",
//         headerName: "Joined",
//         minWidth: 140,
//         valueFormatter: (value) => formatDate(value),
//     },
//     {
//         field: "last_login",
//         headerName: "Last Login",
//         minWidth: 140,
//         valueFormatter: (value) => formatDate(value),
//     },
// ];

// export default function Customers() {
//     const loadingStartTime = useRef(null);

//     const [cursorQuery, setCursorQuery] = useState("");
//     const [pageData, setPageData] = useState([]);
//     const [showLoading, setShowLoading] = useState(true);

//     const {
//         data: customers,
//         isLoading,
//         isFetching,
//         error,
//     } = useApiQuery({
//         path: "/api/account-customers/",
//         auth: true,
//         params: {
//             q: "",
//             page_size: PAGE_SIZE,
//             ...(cursorQuery ? { cursor: cursorQuery } : {}),
//         },
//         queryKey: ["customers", cursorQuery],
//         placeholderData: keepPreviousData,
//         refetchOnWindowFocus: false,
//     });

//     const getCursor = (url) => {
//         if (!url) return null;
//         return new URL(url, BASE_URL).searchParams.get("cursor");
//     };

//     const loadMore = () => {
//         if (!customers?.next || isFetching) return;

//         const nextCursor = getCursor(customers.next);

//         if (nextCursor) {
//             setCursorQuery(nextCursor);
//         }
//     };

//     // Append results without duplicates.
//     useEffect(() => {
//         if (!customers?.results) return;

//         setPageData((previous) => {
//             const existingIds = new Set(
//                 previous.map((customer) => customer.id)
//             );

//             const newCustomers = customers.results.filter(
//                 (customer) => !existingIds.has(customer.id)
//             );

//             return [...previous, ...newCustomers];
//         });
//     }, [customers]);

//     // Keep the initial skeleton visible for at least 2 seconds.
//     useEffect(() => {
//         if (isLoading) {
//             loadingStartTime.current = Date.now();
//             setShowLoading(true);
//             return;
//         }

//         if (loadingStartTime.current === null) {
//             setShowLoading(false);
//             return;
//         }

//         const elapsed = Date.now() - loadingStartTime.current;
//         const remaining = Math.max(0, 2000 - elapsed);

//         const timer = setTimeout(() => {
//             setShowLoading(false);
//             loadingStartTime.current = null;
//         }, remaining);

//         return () => clearTimeout(timer);
//     }, [isLoading]);

//     if (error) {
//         return (
//             <Box sx={container}>
//                 <Box sx={errorMessage}>Failed to load data.</Box>
//             </Box>
//         );
//     }

//     if (showLoading) {
//         return (
//             <Box
//                 sx={{
//                     ...container,
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 2,
//                     minWidth: 0,
//                 }}
//             >
//                 <Skeleton
//                     variant="rounded"
//                     animation="wave"
//                     width={150}
//                     height={25}
//                     sx={{
//                         bgcolor: "var(--bg-skeleton-main-70)",
//                         borderRadius: "6px",
//                     }}
//                 />

//                 <Box
//                     sx={{
//                         width: "100%",
//                         minWidth: 0,
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: 1,
//                         p: 2,
//                         border: 1,
//                         borderColor: "divider",
//                         borderRadius: 2,
//                         boxSizing: "border-box",
//                     }}
//                 >
//                     <Box
//                         sx={{
//                             display: "flex",
//                             gap: 2,
//                             alignItems: "center",
//                             pb: 1,
//                             borderBottom: 1,
//                             borderColor: "divider",
//                         }}
//                     >
//                         {Array.from({ length: 4 }).map((_, index) => (
//                             <Skeleton
//                                 key={index}
//                                 variant="rounded"
//                                 animation="wave"
//                                 sx={{
//                                     flex: 1,
//                                     minWidth: 0,
//                                     height: 25,
//                                     bgcolor: "var(--bg-skeleton-main-70)",
//                                     borderRadius: "6px",
//                                 }}
//                             />
//                         ))}
//                     </Box>

//                     {Array.from({ length: 10 }).map((_, index) => (
//                         <Box
//                             key={index}
//                             sx={{
//                                 display: "flex",
//                                 gap: 2,
//                                 alignItems: "center",
//                                 py: 1,
//                                 borderBottom: index < 3 ? 1 : 0,
//                                 borderColor: "divider",
//                             }}
//                         >
//                             {Array.from({ length: 4 }).map(
//                                 (_, columnIndex) => (
//                                     <Skeleton
//                                         key={columnIndex}
//                                         variant="rounded"
//                                         animation="wave"
//                                         sx={{
//                                             flex: 1,
//                                             minWidth: 0,
//                                             height: 30,
//                                             bgcolor:
//                                                 "var(--bg-skeleton-main-70)",
//                                             borderRadius: "5px",
//                                         }}
//                                     />
//                                 )
//                             )}
//                         </Box>
//                     ))}
//                 </Box>
//             </Box>
//         );
//     }

//     return (
//         <Box
//             sx={{
//                 ...container,
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 2,
//                 minWidth: 0,
//             }}
//         >
//             <GlobalStyles
//                 styles={{
//                     // Sort menu items
//                     ".MuiDataGrid-menu .MuiMenuItem-root": {
//                         fontSize: "var(--fs-sm) !important",
//                         fontWeight: "var(--fw-medium)",
//                         color: "var(--text-main)",
//                     },

//                     // Sort menu text
//                     ".MuiDataGrid-menu .MuiMenuItem-root .MuiTypography-root": {
//                         fontSize: "var(--fs-sm) !important",
//                         color: "var(--text-main)",
//                     },

//                     // Sort menu icons
//                     ".MuiDataGrid-menu .MuiMenuItem-root .MuiSvgIcon-root": {
//                         fontSize: "var(--fs-md) !important",
//                         color: "var(--text-main)",
//                     },

//                     // Sort menu hover
//                     ".MuiDataGrid-menu .MuiMenuItem-root:hover": {
//                         backgroundColor: "var(--bg-hover-mui-30)",
//                     },
//                 }}
//             />
//             <Box
//                 sx={{
//                     ...title,
//                     justifyContent: "flex-start",
//                 }}
//             >
//                 Customers
//             </Box>

//             <Box sx={{ width: "100%", minWidth: 0 }}>
//                 <DataGrid
//                     rows={pageData}
//                     columns={columns}
//                     getRowId={(row) => row.id}
//                     disableRowSelectionOnClick
//                     pageSizeOptions={[5, 10, 25, 50]}
//                     initialState={{
//                         pagination: {
//                             paginationModel: {
//                                 page: 0,
//                                 pageSize: 10,
//                             },
//                         },
//                     }}
//                     slotProps={{
//                         columnMenu: {
//                             slotProps: {
//                                 paper: {
//                                     sx: {
//                                         "& .MuiMenuItem-root": {
//                                             fontSize: "var(--fs-sm)",
//                                             fontWeight: "var(--fw-medium)",
//                                             color: "var(--text-main)",
//                                         },
//                                         "& .MuiMenuItem-root .MuiSvgIcon-root": {
//                                             fontSize: "var(--fs-md)",
//                                             color: "var(--text-main)",
//                                         },
//                                         "& .MuiMenuItem-root:hover": {
//                                             backgroundColor:
//                                                 "var(--bg-hover-mui-30)",
//                                         },
//                                     },
//                                 },
//                             },
//                         },
//                     }}
//                     sx={{
//                         border: 1,
//                         borderColor: "divider",
//                         borderRadius: 2,

//                         // Column headers
//                         "& .MuiDataGrid-columnHeaders": {
//                             backgroundColor: "action.hover",
//                             ...tableStyle,
//                         },
//                         "& .MuiDataGrid-columnHeader": {
//                             ...tableStyle,
//                         },
//                         "& .MuiDataGrid-columnHeaderTitle": {
//                             ...tableStyle,
//                         },

//                         // Sort icon and column menu button
//                         "& .MuiDataGrid-sortIcon": {
//                             color: "var(--text-main)",
//                             fontSize: "var(--fs-md)",
//                         },
//                         "& .MuiDataGrid-menuIconButton": {
//                             color: "var(--text-main)",
//                         },
//                         "& .MuiDataGrid-filterIcon": {
//                             color: "var(--text-main)",
//                             fontSize: "var(--fs-md)",
//                         },

//                         // Cells
//                         "& .MuiDataGrid-cell": {
//                             display: "flex",
//                             alignItems: "center",
//                             ...tableStyle,
//                         },

//                         // Footer and pagination
//                         "& .MuiDataGrid-footerContainer": {
//                             color: "var(--text-main)",
//                         },
//                         "& .MuiTablePagination-root": {
//                             color: "var(--text-main)",
//                             fontSize: "var(--fs-sm)",
//                         },
//                         "& .MuiTablePagination-selectLabel": {
//                             fontSize: "var(--fs-sm)",
//                             fontWeight: "var(--fw-semibold)",
//                             color: "var(--text-main)",
//                         },
//                         "& .MuiTablePagination-displayedRows": {
//                             fontSize: "var(--fs-sm)",
//                             fontWeight: "var(--fw-semibold)",
//                             color: "var(--text-main)",
//                         },
//                         "& .MuiTablePagination-select": {
//                             fontSize: "var(--fs-sm)",
//                             color: "var(--text-main)",
//                         },
//                         "& .MuiTablePagination-actions .MuiIconButton-root": {
//                             color: "var(--text-main)",
//                         },
//                         "& .MuiTablePagination-actions .Mui-disabled": {
//                             opacity: 0.6,
//                         },

//                         // Checkbox
//                         "& .MuiDataGrid-checkboxInput": {
//                             color: "var(--text-main)",
//                         },
//                     }}
//                 />
//             </Box>

//             <Box
//                 sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: 2,
//                     py: 1,
//                 }}
//             >
//                 <Button
//                     sx={{
//                         fontSize: "var(--fs-sm)",
//                         fontWeight: "var(--fw-medium)",
//                         textTransform: "capitalize",
//                         backgroundColor: "var(--bg-inverse)",
//                         color: "var(--text-inverse)",
//                         "&:hover": {
//                             opacity: 0.8,
//                         },
//                     }}
//                     variant="contained"
//                     onClick={loadMore}
//                     disabled={!customers?.next || isFetching}
//                     startIcon={
//                         isFetching ? (
//                             <CircularProgress size={16} />
//                         ) : null
//                     }
//                 >
//                     {isFetching ? "Loading..." : "Load More"}
//                 </Button>
//             </Box>
//         </Box>
//     );
// }





import { useEffect, useState, useRef } from "react";
import { keepPreviousData } from "@tanstack/react-query";

import { useApiQuery } from "../../../hooks/queries/useApiQuery";
import { BASE_URL } from "../../../config";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";
import GlobalStyles from "@mui/material/GlobalStyles";

import { title, container, errorMessage } from "../dashboardStyle";

const PAGE_SIZE = 10;

const DEFAULT_FILTERS = {
    id: "",
    status: "",
    has_orders: "",
    joined: "",
    last_login: "",
};

const tableStyle = {
    color: "var(--text-main)",
    fontSize: "var(--fs-sm)",
    fontWeight: "var(--fw-semibold)",
};

const filterControlStyle = {
    "& .MuiInputBase-root": {
        color: "var(--text-main)",
        fontSize: "var(--fs-sm)",
    },
    "& .MuiInputLabel-root": {
        color: "var(--text-muted)",
        fontSize: "var(--fs-sm)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--border-main)",
    },
    "& .MuiSvgIcon-root": {
        color: "var(--text-main)",
    },
    "& .MuiMenuItem-root": {
        fontSize: "var(--fs-sm)",
    },
};

const formatDate = (value) => {
    if (!value) return "Never";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Never";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};

const formatMoney = (value) => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) return "৳0.00";

    return `৳${amount.toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const columns = [
    {
        field: "id",
        headerName: "ID",
        width: 80,
    },
    {
        field: "name",
        headerName: "Name",
        minWidth: 150,
        flex: 1,
    },
    {
        field: "email",
        headerName: "Email",
        minWidth: 220,
        flex: 1.5,
    },
    {
        field: "phone",
        headerName: "Phone",
        minWidth: 140,
        flex: 1,
        valueFormatter: (value) => value || "—",
    },
    {
        field: "status",
        headerName: "Status",
        minWidth: 120,
        renderCell: (params) => {
            const active = params.value === "active";

            return (
                <Chip
                    label={params.value || "Unknown"}
                    size="small"
                    color={active ? "success" : "default"}
                    variant="outlined"
                    sx={{
                        color: "var(--text-main)",
                        fontSize: "var(--fs-sm)",
                        fontWeight: "var(--fw-semibold)",
                        px: 1.5,
                        py: 1.5,
                    }}
                />
            );
        },
    },
    {
        field: "orders_count",
        headerName: "Orders",
        type: "number",
        width: 100,
    },
    {
        field: "total_spent",
        headerName: "Total Spent",
        minWidth: 140,
        valueFormatter: (value) => formatMoney(value),
    },
    {
        field: "joined_at",
        headerName: "Joined",
        minWidth: 140,
        valueFormatter: (value) => formatDate(value),
    },
    {
        field: "last_login",
        headerName: "Last Login",
        minWidth: 140,
        valueFormatter: (value) => formatDate(value),
    },
];

export default function Customers() {
    const loadingStartTime = useRef(null);
    const filterChangeTimer = useRef(null);

    const [cursorQuery, setCursorQuery] = useState("");
    const [pageData, setPageData] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    const {
        data: customers,
        isLoading,
        isFetching,
        error,
    } = useApiQuery({
        path: "/api/account-customers/",
        auth: true,
        params: {
            page_size: PAGE_SIZE,
            ...(filters.id.trim()
                ? { id: filters.id.trim() }
                : {}),
            ...(filters.status
                ? { status: filters.status }
                : {}),
            ...(filters.has_orders
                ? { has_orders: filters.has_orders }
                : {}),
            ...(filters.joined
                ? { joined: filters.joined }
                : {}),
            ...(filters.last_login
                ? { last_login: filters.last_login }
                : {}),
            ...(cursorQuery
                ? { cursor: cursorQuery }
                : {}),
        },
        queryKey: ["customers", cursorQuery, filters],
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    const getCursor = (url) => {
        if (!url) return null;

        return new URL(url, BASE_URL).searchParams.get("cursor");
    };

    const resetPagination = () => {
        setCursorQuery("");
        setPageData([]);
    };

    const handleFilterChange = (field, value) => {
        if (filterChangeTimer.current) {
            clearTimeout(filterChangeTimer.current);
        }

        setFilters((previous) => ({
            ...previous,
            [field]: value,
        }));

        resetPagination();
    };

    const clearFilters = () => {
        setFilters({ ...DEFAULT_FILTERS });
        resetPagination();
    };

    const loadMore = () => {
        if (!customers?.next || isFetching) return;

        const nextCursor = getCursor(customers.next);

        if (nextCursor) {
            setCursorQuery(nextCursor);
        }
    };

    // Append new results without duplicates.
    useEffect(() => {
        if (!customers?.results) return;

        setPageData((previous) => {
            const existingIds = new Set(
                previous.map((customer) => customer.id)
            );

            const newCustomers = customers.results.filter(
                (customer) => !existingIds.has(customer.id)
            );

            return [...previous, ...newCustomers];
        });
    }, [customers]);

    // Keep the initial skeleton visible for at least 2 seconds.
    useEffect(() => {
        if (isLoading) {
            loadingStartTime.current = Date.now();
            setShowLoading(true);
            return;
        }

        if (loadingStartTime.current === null) {
            setShowLoading(false);
            return;
        }

        const elapsed = Date.now() - loadingStartTime.current;
        const remaining = Math.max(0, 2000 - elapsed);

        const timer = setTimeout(() => {
            setShowLoading(false);
            loadingStartTime.current = null;
        }, remaining);

        return () => clearTimeout(timer);
    }, [isLoading]);

    useEffect(() => {
        return () => {
            if (filterChangeTimer.current) {
                clearTimeout(filterChangeTimer.current);
            }
        };
    }, []);

    if (error) {
        return (
            <Box sx={container}>
                <Box sx={errorMessage}>
                    Failed to load data.
                </Box>
            </Box>
        );
    }

    if (showLoading) {
        return (
            <Box
                sx={{
                    ...container,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    minWidth: 0,
                }}
            >
                <Skeleton
                    variant="rounded"
                    animation="wave"
                    width={150}
                    height={25}
                    sx={{
                        bgcolor: "var(--bg-skeleton-main-70)",
                        borderRadius: "6px",
                    }}
                />

                <Box
                    sx={{
                        width: "100%",
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        p: 2,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                        boxSizing: "border-box",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            pb: 1,
                            borderBottom: 1,
                            borderColor: "divider",
                        }}
                    >
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                variant="rounded"
                                animation="wave"
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                    height: 25,
                                    bgcolor: "var(--bg-skeleton-main-70)",
                                    borderRadius: "6px",
                                }}
                            />
                        ))}
                    </Box>

                    {Array.from({ length: 10 }).map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                gap: 2,
                                alignItems: "center",
                                py: 1,
                                borderBottom: index < 3 ? 1 : 0,
                                borderColor: "divider",
                            }}
                        >
                            {Array.from(
                                { length: 4 }
                            ).map((_, columnIndex) => (
                                <Skeleton
                                    key={columnIndex}
                                    variant="rounded"
                                    animation="wave"
                                    sx={{
                                        flex: 1,
                                        minWidth: 0,
                                        height: 30,
                                        bgcolor:
                                            "var(--bg-skeleton-main-70)",
                                        borderRadius: "5px",
                                    }}
                                />
                            ))}
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                ...container,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: 0,
            }}
        >
            <GlobalStyles
                styles={{
                    ".MuiDataGrid-menu .MuiMenuItem-root": {
                        fontSize: "var(--fs-sm) !important",
                        fontWeight: "var(--fw-medium)",
                        color: "var(--text-main)",
                    },
                    ".MuiDataGrid-menu .MuiMenuItem-root .MuiTypography-root": {
                        fontSize: "var(--fs-sm) !important",
                        color: "var(--text-main)",
                    },
                    ".MuiDataGrid-menu .MuiMenuItem-root .MuiSvgIcon-root": {
                        fontSize: "var(--fs-md) !important",
                        color: "var(--text-main)",
                    },
                    ".MuiDataGrid-menu .MuiMenuItem-root:hover": {
                        backgroundColor: "var(--bg-hover-mui-30)",
                    },

                    ".MuiDataGrid-panelContent": {
                        fontSize: "var(--fs-sm) !important",
                        fontWeight: "var(--fw-medium) !important",
                        color: "var(--text-main) !important",
                    },

                    ".MuiFormLabel-root": {
                        fontSize: "var(--fs-sm) !important",
                        fontWeight: "var(--fw-medium)",
                        color: "var(--text-main) !important",
                    },

                    ".MuiSelect-select": {
                        color: "var(--text-main) !important",
                        fontWeight: "var(--fw-medium) !important",
                        fontSize: "var(--fs-sm) !important",
                    },

                    ".MuiButtonBase-root": {
                        fontSize: "var(--fs-sm) !important",
                        fontWeight: "var(--fw-medium) !important",
                        color: "var(--text-main) !important",
                    }
                }}
            />

            {/* Heading */}
            <Box
                sx={{
                    ...title,
                    justifyContent: "flex-start",
                }}
            >
                Customers
            </Box>

            {/* Filters */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                    alignItems: "center",
                    width: "100%",
                    minWidth: 0,
                }}
            >
                <TextField
                    label="Customer ID"
                    type="number"
                    size="small"
                    value={filters.id}
                    onChange={(event) =>
                        handleFilterChange("id", event.target.value)
                    }
                    slotProps={{
                        htmlInput: { min: 1 },
                    }}
                    sx={{
                        ...filterControlStyle,
                        width: { xs: "100%", sm: 130 },
                    }}
                />

                <FormControl
                    size="small"
                    sx={{
                        ...filterControlStyle,
                        width: { xs: "100%", sm: 150 },
                    }}
                >
                    <InputLabel id="customer-status-label">
                        Status
                    </InputLabel>

                    <Select
                        labelId="customer-status-label"
                        label="Status"
                        value={filters.status}
                        onChange={(event) =>
                            handleFilterChange(
                                "status",
                                event.target.value
                            )
                        }
                    >
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="">All statuses</MenuItem>
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="active">Active</MenuItem>
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>

                <FormControl
                    size="small"
                    sx={{
                        ...filterControlStyle,
                        width: { xs: "100%", sm: 160 },
                    }}
                >
                    <InputLabel id="customer-orders-label">
                        Orders
                    </InputLabel>

                    <Select
                        labelId="customer-orders-label"
                        label="Orders"
                        value={filters.has_orders}
                        onChange={(event) =>
                            handleFilterChange(
                                "has_orders",
                                event.target.value
                            )
                        }
                    >
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="">All customers</MenuItem>
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="true">Has orders</MenuItem>
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="false">No orders</MenuItem>
                    </Select>
                </FormControl>

                <FormControl
                    size="small"
                    sx={{
                        ...filterControlStyle,
                        width: { xs: "100%", sm: 160 },
                    }}
                >
                    <InputLabel id="customer-joined-label">
                        Joined
                    </InputLabel>

                    <Select
                        labelId="customer-joined-label"
                        label="Joined"
                        value={filters.joined}
                        onChange={(event) =>
                            handleFilterChange(
                                "joined",
                                event.target.value
                            )
                        }
                    >
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="">Any time</MenuItem>
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="1d">Last 24 hours</MenuItem>
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="1w">Last 7 days</MenuItem>
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="1m">Last 30 days</MenuItem>
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="1y">Last 365 days</MenuItem>
                    </Select>
                </FormControl>

                <FormControl
                    size="small"
                    sx={{
                        ...filterControlStyle,
                        width: { xs: "100%", sm: 160 },
                    }}
                >
                    <InputLabel id="customer-login-label">
                        Last Login
                    </InputLabel>

                    <Select
                        labelId="customer-login-label"
                        label="Last Login"
                        value={filters.last_login}
                        onChange={(event) =>
                            handleFilterChange(
                                "last_login",
                                event.target.value
                            )
                        }
                    >
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="">Any time</MenuItem>
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="1d">Last 24 hours</MenuItem>
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="1w">Last 7 days</MenuItem>
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="1m">Last 30 days</MenuItem>
                        <MenuItem sx={{ fontSize: "var(--fs-sm)", color: "var(--text-main)" }} value="1y">Last 365 days</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant="outlined"
                    onClick={clearFilters}
                    disabled={Object.values(filters).every(
                        (value) => value === ""
                    )}
                    sx={{
                        textTransform: "none",
                        fontSize: "var(--fs-sm)",
                        fontWeight: "var(--fw-medium)",
                        color: "var(--text-main)",
                        borderColor: "var(--border-main)",
                        "&:hover": {
                            backgroundColor: "var(--bg-hover-mui-30)",
                            borderColor: "var(--border-main)",
                        },
                    }}
                >
                    Clear filters
                </Button>
            </Box>

            {/* Customers table */}
            <Box sx={{ width: "100%", minWidth: 0 }}>
                <DataGrid
                    rows={pageData}
                    columns={columns}
                    getRowId={(row) => row.id}
                    disableRowSelectionOnClick
                    pageSizeOptions={[5, 10, 25, 50]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                page: 0,
                                pageSize: 10,
                            },
                        },
                    }}
                    slotProps={{
                        columnMenu: {
                            slotProps: {
                                paper: {
                                    sx: {
                                        "& .MuiMenuItem-root": {
                                            fontSize: "var(--fs-sm)",
                                            fontWeight: "var(--fw-medium)",
                                            color: "var(--text-main)",
                                        },
                                        "& .MuiMenuItem-root .MuiSvgIcon-root": {
                                            fontSize: "var(--fs-md)",
                                            color: "var(--text-main)",
                                        },
                                        "& .MuiMenuItem-root:hover": {
                                            backgroundColor:
                                                "var(--bg-hover-mui-30)",
                                        },
                                    },
                                },
                            },
                        },
                    }}
                    sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,

                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "action.hover",
                            ...tableStyle,
                        },
                        "& .MuiDataGrid-columnHeader": {
                            ...tableStyle,
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                            ...tableStyle,
                        },
                        "& .MuiDataGrid-sortIcon": {
                            color: "var(--text-main)",
                            fontSize: "var(--fs-md)",
                        },
                        "& .MuiDataGrid-menuIconButton": {
                            color: "var(--text-main)",
                        },
                        "& .MuiDataGrid-filterIcon": {
                            color: "var(--text-main)",
                            fontSize: "var(--fs-md)",
                        },
                        "& .MuiDataGrid-cell": {
                            display: "flex",
                            alignItems: "center",
                            ...tableStyle,
                        },
                        "& .MuiDataGrid-footerContainer": {
                            color: "var(--text-main)",
                        },
                        "& .MuiTablePagination-root": {
                            color: "var(--text-main)",
                            fontSize: "var(--fs-sm)",
                        },
                        "& .MuiTablePagination-selectLabel": {
                            fontSize: "var(--fs-sm)",
                            fontWeight: "var(--fw-semibold)",
                            color: "var(--text-main)",
                        },
                        "& .MuiTablePagination-displayedRows": {
                            fontSize: "var(--fs-sm)",
                            fontWeight: "var(--fw-semibold)",
                            color: "var(--text-main)",
                        },
                        "& .MuiTablePagination-select": {
                            fontSize: "var(--fs-sm)",
                            color: "var(--text-main)",
                        },
                        "& .MuiTablePagination-actions .MuiIconButton-root": {
                            color: "var(--text-main)",
                        },
                        "& .MuiTablePagination-actions .Mui-disabled": {
                            opacity: 0.6,
                        },
                        "& .MuiDataGrid-checkboxInput": {
                            color: "var(--text-main)",
                        },
                        "& .MuiDataGrid-overlay": {
                            fontSize: "var(--fs-md)",
                            fontWeight: "var(--fw-medium)",
                        },
                    }}
                />
            </Box>

            {/* Load more */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    py: 1,
                }}
            >
                <Button
                    sx={{
                        fontSize: "var(--fs-sm)",
                        fontWeight: "var(--fw-medium)",
                        textTransform: "capitalize",
                        backgroundColor: "var(--bg-inverse)",
                        color: "var(--text-inverse)",
                        "&:hover": {
                            opacity: 0.8,
                        },
                        opacity: isFetching || customers ? 0.6 : 1,
                    }}
                    variant="contained"
                    onClick={loadMore}
                    disabled={!customers?.next || isFetching}
                    startIcon={
                        isFetching ? (
                            <CircularProgress size={16} />
                        ) : null
                    }
                >
                    {isFetching ? "Loading..." : "Load More"}
                </Button>
            </Box>
        </Box>
    );
}
