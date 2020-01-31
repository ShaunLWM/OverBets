import Grid from "@material-ui/core/Grid";
import fetch from "node-fetch";
import React, { useContext, useEffect } from "react";
import { store } from "../../store";
import MatchBets from "../MatchBets";
import MatchCard from "../MatchCard";

function MatchesContainer() {
    const { state, dispatch } = useContext(store);

    useEffect(() => {
        async function fetchMatches() {
            const matches = await fetch("http://localhost:3001/matches");
            const data = await matches.json();
            dispatch({ type: "setMatches", data });
        }

        if (state["matches"].length < 1) fetchMatches();
    }, [dispatch]);

    return (
        <Grid container>
            {
                state["matches"].map(({ match, users }) => {
                    return (
                        <React.Fragment key={`${match["match_id"]}`}>
                            <Grid item xs={12} sm={12} md={6}><MatchCard match={match} /></Grid>
                            <Grid item xs={12} sm={12} md={6}><MatchBets users={users} /></Grid>
                        </React.Fragment>
                    )
                })
            }
        </Grid >
    )
}

MatchesContainer.whyDidYouRender = true;
export default React.memo(MatchesContainer);
