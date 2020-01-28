import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(() => ({
    betsCoins: {
        position: "relative",
        bottom: 0,
        left: 0,
    }
}));

function BetsCoins({ coins }) {
    const classes = useStyles();
    return (<div className={classes.betsCoins}><span>{coins}</span></div>);
}

export default React.memo(BetsCoins);
