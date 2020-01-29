import TextField from "@material-ui/core/TextField";
import React from "react";

export default function BetMatchForm() {
    return (
        <TextField
            id="outlined-number"
            label="Number"
            type="number"
            InputLabelProps={{
                shrink: true,
            }}
            variant="outlined"
        />
    );
}
