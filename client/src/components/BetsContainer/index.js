import Grid from '@material-ui/core/Grid';
import React from "react";
import BetsAvatar from "../BetsAvatar";
import BetsCoins from "../BetsCoins";
function BetsContainer(props) {
    return (
        <Grid item xs={2} style={{ textAlign: "center" }}>
            <BetsAvatar {...props} />
            <BetsCoins {...props} />
        </Grid>
    );
}

BetsContainer.whyDidYouRender = true;
export default React.memo(BetsContainer);
