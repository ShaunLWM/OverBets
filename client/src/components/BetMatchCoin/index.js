import TextField from "@material-ui/core/TextField";
import React from "react";

export default function BetMatchCoin() {
    return (
        <TextField
            id="outlined-number"
            label="Coins To Bet"
            type="number"
            InputLabelProps={{
                shrink: true,
            }}
            variant="outlined"
        />
    );
}
