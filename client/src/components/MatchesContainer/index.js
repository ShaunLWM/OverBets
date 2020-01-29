import Grid from '@material-ui/core/Grid';
import fetch from "node-fetch";
import React, { useContext, useEffect } from 'react';
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

        fetchMatches();
    }, []);

    return (
        <Grid container>
            {
                state["matches"].map((m, i) => {
                    return (
                        <>
                            <Grid item xs={12} sm={12} md={6} key={`${m["match_id"]}-match`}><MatchCard match={m} key={m["match_id"]} /></Grid>
                            <Grid item xs={12} sm={12} md={6} key={m["match_id"]}><MatchBets users={m["users"]} /></Grid>
                        </>
                    )
                })
            }
        </Grid>
    )
}

export default MatchesContainer;
