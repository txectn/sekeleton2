import * as React from "react";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";

import { ChevronsUpDown, Check } from "lucide-react";

import {
    hoverStyles,
    menuBtnFont,
} from "../dashboardStyle";

export default function DashboardSelect({
    setFormData,
    formData,
    menuData,
    name,
    type = "array",
    selectOne = type === "number",
    checkIcon = false,
    children,
    ...props
}) {
    const cssStyles = {
        profileButton: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "transparent",
            color: menuBtnFont.color_main,
            boxShadow: "0 0 4px var(--shadow-80)",
            width: "100%",
            minHeight: "4.5rem",
            padding: "0 1rem",
            fontSize: menuBtnFont.size,
            fontWeight: menuBtnFont.weight,
            textTransform: "none",
            borderRadius: "10px",
            gap: "12px",

            "&:hover": {
                backgroundColor: hoverStyles.mui_main,
            },

            "& .MuiTouchRipple-root, & .MuiTouchRipple-child": {
                color: hoverStyles.mui_ripple,
            },
        },

        selectedItems: {
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "6px",
            minWidth: 0,
            flex: 1,
        },

        selectedItem: {
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "var(--bg-skeleton-main)",
            borderRadius: "5px",
            padding: "4px 8px",
            lineHeight: 1.4,
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            fontSize: "var(--fs-xs)",
        },

        menuItem: {
            ...menuBtnFont.alignMent,
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            fontSize: "var(--fs-sm)",
            fontWeight: menuBtnFont.weight,
            color: menuBtnFont.color_main,
            backgroundColor: "transparent",
            transition: "background-color 150ms ease",

            "&:hover": {
                backgroundColor: hoverStyles.mui_main,
            },

            "& .MuiTouchRipple-root, & .MuiTouchRipple-child": {
                color: hoverStyles.mui_ripple,
            },
        },

        checkbox: {
            transform: "scale(1.3)",
            padding: 0,
            color: "var(--border-main-70)",

            "&.Mui-checked": {
                color: menuBtnFont.color_main,
            },
        },

        itemWrapper: {
            display: "flex",
            alignItems: "center",
            minWidth: 0,
        },

        checkIcon: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "16.5px",
            flexShrink: 0,
        },
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [buttonWidth, setButtonWidth] = React.useState(0);

    const open = Boolean(anchorEl);

    const id = React.useId();
    const buttonId = `${id}-button`;
    const menuId = `${id}-menu`;

    const selectedIds = React.useMemo(() => {
        const value = formData[name];

        if (value == null) {
            return [];
        }

        if (Array.isArray(value)) {
            return value.map((item) =>
                typeof item === "object" && item !== null
                    ? item.id
                    : item
            );
        }

        if (typeof value === "object") {
            return value.id == null ? [] : [value.id];
        }

        return [value];
    }, [formData, name]);

    const selectedItems = menuData.filter((item) =>
        selectedIds.includes(item.id)
    );

    const handleClick = (event) => {
        setButtonWidth(
            event.currentTarget.getBoundingClientRect().width
        );

        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (itemId, checked) => {
        setFormData((prev) => {
            const currentValue = prev[name];

            const currentIds = currentValue == null
                ? []
                : Array.isArray(currentValue)
                    ? currentValue.map((item) =>
                        typeof item === "object" && item !== null
                            ? item.id
                            : item
                    )
                    : typeof currentValue === "object"
                        ? currentValue.id == null
                            ? []
                            : [currentValue.id]
                        : [currentValue];

            let nextIds;

            if (selectOne) {
                nextIds = checked ? [itemId] : [];
            } else {
                nextIds = checked
                    ? currentIds.includes(itemId)
                        ? currentIds
                        : [...currentIds, itemId]
                    : currentIds.filter((id) => id !== itemId);
            }

            let nextValue;

            if (type === "number") {
                nextValue = nextIds[0] ?? null;
            } else if (type === "object") {
                const objects = nextIds
                    .map((id) =>
                        menuData.find((item) => item.id === id)
                    )
                    .filter(Boolean);

                nextValue = selectOne
                    ? objects[0] ?? null
                    : objects;
            } else {
                nextValue = nextIds;
            }

            return {
                ...prev,
                [name]: nextValue,
            };
        });
    };

    const handleClear = () => {
        setFormData((prev) => ({
            ...prev,
            [name]: type === "array" ? [] : null,
        }));
    };

    return (
        <div {...props}>
            <Button
                id={buttonId}
                sx={cssStyles.profileButton}
                aria-controls={open ? menuId : undefined}
                aria-haspopup="true"
                aria-expanded={open}
                onClick={handleClick}
            >
                <span style={cssStyles.selectedItems}>
                    {selectedItems.length > 0 ? (
                        selectedItems.map((item) => (
                            <span
                                key={item.id}
                                style={cssStyles.selectedItem}
                            >
                                {item.name}
                            </span>
                        ))
                    ) : (
                        <span>None</span>
                    )}
                </span>

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
                            width: `${buttonWidth}px`,
                            minWidth: 0,
                            maxWidth: `${buttonWidth}px`,
                            boxSizing: "border-box",
                            borderRadius: "10px",
                            backgroundColor: "var(--bg-main)",
                            boxShadow: "var(--shadow-mui)",
                        },
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
                        backgroundColor: selectedIds.length === 0 && checkIcon ? "var(--bg-skeleton-main)" : "transparent",
                        padding: checkIcon ? "1.5rem 1rem" : "1.3rem 1.5rem",
                    }}
                    onClick={() => {
                        handleClear();
                        if (selectOne) {
                            handleClose();
                        }
                    }}
                >
                    {checkIcon ? (
                        <span style={cssStyles.checkIcon}>
                            {selectedIds.length === 0 && (
                                <Check
                                    size={16.5}
                                    strokeWidth={2.5}
                                    color={menuBtnFont.color_main}
                                />
                            )}
                        </span>
                    ) : (
                        <Checkbox
                            checked={selectedIds.length === 0}
                            sx={cssStyles.checkbox}
                            onChange={handleClear}
                            onClick={(event) => event.stopPropagation()}
                        />
                    )}

                    <span style={cssStyles.itemWrapper}>
                        Select {children}
                    </span>
                </MenuItem>

                {menuData.map((item) => {
                    const isSelected = selectedIds.includes(item.id);

                    return (
                        <MenuItem
                            key={item.id}
                            sx={{
                                ...cssStyles.menuItem,
                                backgroundColor: isSelected && checkIcon
                                    ? "var(--bg-skeleton-main)"
                                    : "transparent",
                                padding: checkIcon ? "1.5rem 1rem" : "1.3rem 1.5rem",
                            }}
                            onClick={() => {
                                handleChange(item.id, !isSelected);
                                if (selectOne) {
                                    handleClose();
                                }
                            }}
                        >
                            {checkIcon ? (
                                <span style={cssStyles.checkIcon}>
                                    {isSelected && (
                                        <Check
                                            size={16.5}
                                            strokeWidth={2.5}
                                            color={menuBtnFont.color_main}
                                        />
                                    )}
                                </span>
                            ) : (
                                <Checkbox
                                    checked={isSelected}
                                    sx={cssStyles.checkbox}
                                    onChange={(event) => {
                                        handleChange(
                                            item.id,
                                            event.target.checked
                                        );
                                    }}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                    }}
                                />
                            )}

                            <span style={cssStyles.itemWrapper}>
                                {item.name}
                            </span>
                        </MenuItem>
                    );
                })}
            </Menu>
        </div>
    );
}
