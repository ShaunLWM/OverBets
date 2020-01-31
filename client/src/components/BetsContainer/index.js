import Grid from '@material-ui/core/Grid';
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import BetsAvatar from "../BetsAvatar";
import BetsCoins from "../BetsCoins";

const useStyles = makeStyles(() => ({
    betGrid: {
        textAlign: "center",
    }
}));

function BetsContainer(props) {
    const classes = useStyles();

    return (
        <Grid item xs={4} sm={2} className={classes.betGrid}>
            <BetsAvatar {...props} />
            <BetsCoins {...props} />
        </Grid>
    );
}

BetsContainer.whyDidYouRender = true;
export default React.memo(BetsContainer);
