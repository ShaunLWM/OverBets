import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, { useState } from "react";

function BetMatchTeam({ teamOneName, teamTwoName, handleTeamChange }) {
    const [value, setValue] = useState("0");
    const handleChange = event => {
        setValue(event.target.value);
        handleTeamChange(event.target.value);
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
