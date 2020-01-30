import TextField from "@material-ui/core/TextField";
import React, { useContext } from "react";
import { store } from "../../store";

const BetMatchCoin = React.forwardRef((props, ref) => {
    const { state, dispatch } = useContext(store);

    return (
        <TextField
            inputRef={ref}
            id="outlined-number"
            label="Coins To Bet"
            type="number"
            InputLabelProps={{
                shrink: true,
            }}
            variant="outlined"
        />
    );
});

BetMatchCoin.whyDidYouRender = true;
export default React.memo(BetMatchCoin);
