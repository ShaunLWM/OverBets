import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
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

function BetsAvatar({ img, name, color = "#70A1C5" }) {
    const classes = useStyles();
    return (
        <Tooltip title={name} aria-label="add">
            <img src={img} alt="User" className={classes.avatar} style={{ borderColor: color }} />
        </Tooltip>
    )
}

export default React.memo(BetsAvatar);
