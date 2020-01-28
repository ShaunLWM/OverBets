import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import MatchCard from "../MatchCard";

function MatchesContainer() {
    const [matches, setMatches] = useState(new Array(10).fill(""));
    return (
        <Grid container>
            {
                matches.map(() => {
                    return <Grid item xs={12} sm={6}><MatchCard /></Grid>
                })
            }
        </Grid>
    )
}

export default MatchesContainer;
