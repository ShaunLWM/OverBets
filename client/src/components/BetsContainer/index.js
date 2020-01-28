import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import BetsAvatar from "../BetsAvatar";
import BetsCoins from "../BetsCoins";

const useStyles = makeStyles(() => ({
    avatar: {
        border: "2px solid #252422",
        width: "75px",
        height: "75px",
        borderRadius: "100px",
        margin: "4px",
    }
}));

function BetsContainer(props) {
    const classes = useStyles();

    return (
        <div style={{ position: "relative", overflow: "visible", textAlign: "center", margin: "0 auto" }}>
            <BetsAvatar {...props} />
            <BetsCoins {...props} />
        </div>
    );
}

export default React.memo(BetsContainer);
