export const iconsStyles = {
    size: 21,
    color_inverse: 'var(--text-inverse)',
    color_main: 'var(--text-main)',
};

export const logoStyles = {
    size: "24.5px",
}

export const hoverStyles = {
    mui_main: 'var(--bg-hover-mui-main)',
    mui_ripple: 'var(--bg-hover-mui-ripple)',
    mui_inverse: 'var(--bg-hover-mui-inverse)',
}

export const menuBtnFont = {
    size: "var(--fs-sm-md)",
    weight: "var(--fw-regular)",
    color_main: "var(--text-main)",
    color_inverse: "var(--text-inverse)",
    textTransform: "capitalize",
    alignMent: {
        dipplay: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
    }
}

export const linkButtonFont = {
    size_sm_md: "var(--fs-sm-md)",
    size_sm: "var(--fs-sm)",
    weight: "var(--fw-medium)",
    color_main: "var(--text-main)",
    color_inverse: "var(--text-inverse)",
    textTransform: "capitalize",
    alignMent: {
        dipplay: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
    }
}

export const container = {
    minHeight: "calc(100vh - 130px)",
    padding: "2rem",
    paddingLeft: "1rem",
    paddingTop: "1.1rem",
    "@media (max-width: 1000px)": {
        padding: "2rem"
    },
}

export const errorMessage = {
    fontSize: "var(--fs-xl)",
    fontWeight: "var(--fw-semibold)",
    color: "var(--text-main)",
    textAlign: "center",
    marginTop: "20rem"
}

export const title = {
    fontSize: "var(--fs-xl)",
    fontWeight: "var(--fw-bold)",
    color: "var(--text-main)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}
