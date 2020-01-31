import TextField from "@material-ui/core/TextField";
import React from "react";

function BetMatchCoin(props) {
    return (
        <TextField
            id="outlined-number"
            label="Coins To Bet"
            type="number"
            InputLabelProps={{
                shrink: true,
            }}
            value={props.value}
            onChange={props.onChange}
            variant="outlined"
        />
    );
};

BetMatchCoin.whyDidYouRender = true;
export default React.memo(BetMatchCoin);
