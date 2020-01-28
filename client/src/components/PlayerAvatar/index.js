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

function PlayerAvatar({ img, color = "#70A1C5", coins }) {
    const classes = useStyles();

    return (
        <div style={{ position: "relative", overflow: "visible", textAlign: "center", margin: "0 auto" }}>
            <img src={img} className={classes.avatar} style={{ borderColor: color }} />
            <span>{coins}</span>
        </div>
    );
}

export default React.memo(PlayerAvatar);
