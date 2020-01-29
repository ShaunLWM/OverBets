import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, { useContext, useState } from "react";
import { store } from "../../store";

function BetMatchTeam({ teamOneName, teamTwoName }) {
    const [value, setValue] = useState("0");
    const { state, dispatch } = useContext(store);

    const handleChange = event => {
        setValue(event.target.value);
    };

    return (
        <>
            <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                <FormControlLabel value="0" control={<Radio />} label={teamOneName} />
                <FormControlLabel value="1" control={<Radio />} label={teamTwoName} />
            </RadioGroup>
        </>
    );
}

BetMatchTeam.whyDidYouRender = true;
export default React.memo(BetMatchTeam);
