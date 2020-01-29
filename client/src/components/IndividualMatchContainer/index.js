import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import fetch from "node-fetch";
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { store } from "../../store";
import BetMatchForm from "../BetMatchForm";
import MatchBets from "../MatchBets";
import MatchCard from "../MatchCard";

function IndividualMatchContainer() {
    const { state, dispatch } = useContext(store);
    const { matchId } = useParams();
    const [currentMatch, setCurrentMatch] = useState({});

    useEffect(() => {
        async function fetchMatch() {
            const matches = await fetch(`http://localhost:3001/matches/${matchId}`);
            const data = await matches.json();
            if (!data.success) return console.log(data.msg);
            setCurrentMatch(data["match"]);
        }

        if (state["matches"].length < 1)
            fetchMatch();
        else
            setCurrentMatch(state["matches"].find(match => match.match_id === parseInt(matchId, 10)));
    }, [state["matches"], matchId]);

    return (
        <Grid container justify="center">
            {typeof currentMatch["match_id"] !== "undefined"
                &&
                <>
                    <Grid item xs={12} sm={12} md={6} ><MatchCard match={currentMatch} key={currentMatch["match_id"]} /></Grid>
                    <Grid item xs={12} sm={12} md={6} ><MatchBets users={currentMatch["users"]} /></Grid>
                    <Grid item xs={6}><BetMatchForm /></Grid>
                    <Grid item xs={6}><Button variant="contained">Default</Button></Grid>
                </>
            }
        </Grid>
    )
}

export default IndividualMatchContainer;
