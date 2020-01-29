import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, { useState } from "react";

export default function BetMatchTeam({ teamOneName, teamTwoName }) {
    const [value, setValue] = useState('female');

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
