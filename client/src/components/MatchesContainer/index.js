import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import MatchBets from "../MatchBets";
import MatchCard from "../MatchCard";
function MatchesContainer() {
    const [matches, setMatches] = useState(new Array(10).fill(""));

    return (
        <Grid container>
            {
                matches.map((m, i) => {
                    return (
                        <Grid item xs={12} sm={12} md={6}>
                            {
                                (i % 2 === 0) ? <MatchCard /> : <MatchBets />
                            }
                        </Grid>
                    )

                })
            }
        </Grid>
    )
}

export default MatchesContainer;
