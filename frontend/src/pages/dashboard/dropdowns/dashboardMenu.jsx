import * as React from "react";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { ChevronsUpDown, Check } from "lucide-react";

import {
    hoverStyles,
    menuBtnFont,
} from "../dashboardStyle";

export default function DashboardMenu({
    setFormData,
    menuData,
    name,
    children,
    type="object",
}) {

    const cssStyles = {
        profileButton: {
            justifyContent: "space-between",
            backgroundColor: "transparent",
            color: menuBtnFont.color_main,

            boxShadow: "0 0 4px var(--shadow-80)",

            width: "100%",

            height: "4.5rem",
            padding: "0 1rem",

            fontSize: menuBtnFont.size,
            fontWeight: menuBtnFont.weight,

            textTransform: "capitalize",

            borderRadius: "10px",
            // marginLeft: "100px",

            "&:hover": {
                backgroundColor: hoverStyles.mui_main,
            },

            "& .MuiTouchRipple-root, & .MuiTouchRipple-child": {
                color: hoverStyles.mui_ripple,
            },
        },

        menuItem: {
            ...menuBtnFont.alignMent,
            fontSize: "var(--fs-sm)",
            fontWeight: menuBtnFont.weight,
            color: menuBtnFont.color_main,
            padding: "1.5rem 1rem",
            justifyContent: "flex-start",
            gap: "10px",
            backgroundColor: "transparent",

            "&:hover": {
                backgroundColor: hoverStyles.mui_main,
            },

            "& .MuiTouchRipple-root, & .MuiTouchRipple-child": {
                color: hoverStyles.mui_ripple,
            },
        },

        itemWrapper: {
            display: "flex",
            alignItems: "center",
        },
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const id = React.useId();

    const buttonRef = React.useRef(null);

    const buttonId = `${id}-button`;
    const menuId = `${id}-menu`;

    const [selected, setSelected] = React.useState({});

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (item) => {
        setFormData((prev) => ({
            ...prev,
            [name]: type === "object" ? item : item.id,
        }));

        setSelected({
            id: item.id,
            name: item.name,
        });
    };

    const handleClean = () => {
        setFormData((prev) => ({
            ...prev,
            [name]: {},
        }));

        setSelected({});
    };

    return (
        <div>
            <Button
                ref={buttonRef}
                sx={cssStyles.profileButton}
                id={buttonId}
                aria-controls={open ? menuId : undefined}
                aria-haspopup="true"
                aria-expanded={open}
                onClick={handleClick}
            >
                <span style={cssStyles.itemWrapper}>{selected.name || "None"}</span>
                {/* "Select " + children */}
                <ChevronsUpDown size={16} />
            </Button>

            <Menu
                id={menuId}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            width: buttonRef.current?.offsetWidth,
                            borderRadius: "10px",
                            backgroundColor: "var(--bg-main)",
                            boxShadow: "var(--shadow-mui)",
                        }
                    },
                    list: {
                        "aria-labelledby": buttonId,
                        sx: {
                            padding: 0,
                        },
                    },
                }}
            >
                <MenuItem
                    sx={{
                        ...cssStyles.menuItem,
                        ...(!selected.id
                            ? {
                                backgroundColor: hoverStyles.mui_main,
                            }
                            : {}),
                    }}
                    onClick={() => {
                        handleClose();
                        handleClean();
                    }}
                >
                    <span style={{ width: "1.5rem", ...cssStyles.itemWrapper }}>{!selected.id && (
                        <Check size={16.5} strokeWidth={2.5} color={menuBtnFont.color_main} />
                    )}
                    </span>
                    <span style={cssStyles.itemWrapper}>
                        Select {children}
                    </span>
                </MenuItem>
                {menuData.map((item) => (
                    <MenuItem
                        key={item.id}
                        sx={{
                            ...cssStyles.menuItem,
                            ...(item.id === selected.id
                                ? {
                                    backgroundColor: hoverStyles.mui_main,
                                }
                                : {}),
                        }}
                        onClick={() => {
                            handleClose();
                            handleChange(item);
                        }}
                    >
                        <span style={{
                            ...cssStyles.itemWrapper,
                            width: "1.5rem"
                        }}>
                            {item.id === selected.id && (
                                <Check size={16.5} strokeWidth={2.5} color={menuBtnFont.color_main} />
                            )}
                        </span>
                        <span style={cssStyles.itemWrapper}>
                            {item.name}
                        </span>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}






