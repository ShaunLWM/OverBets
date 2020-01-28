import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(() => ({
    avatar: {
        border: "2px solid #252422",
        width: "75px",
        height: "75px",
        borderRadius: "100px",
        margin: "4px",
    }
}));

function BetsAvatar({ img, color = "#70A1C5" }) {
    const classes = useStyles();
    return <img src={img} alt="User" className={classes.avatar} style={{ borderColor: color }} />
}

export default React.memo(BetsAvatar);
