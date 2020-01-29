import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import fetch from "node-fetch";
import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";
import useDeepCompareEffect from 'use-deep-compare-effect';
import { store } from "../../store";
import BetMatchCoin from "../BetMatchCoin";
import BetMatchTeam from "../BetMatchTeam";
import MatchBets from "../MatchBets";
import MatchCard from "../MatchCard";

function IndividualMatchContainer() {
    const { state, dispatch } = useContext(store);
    const { matchId } = useParams();
    const [currentMatch, setCurrentMatch] = useState({});

    useDeepCompareEffect(() => {
        async function fetchMatch() {
            const matches = await fetch(`http://localhost:3001/matches/${matchId}`);
            const data = await matches.json();
            if (!data.success) return console.log(data.msg);
            setCurrentMatch(data["match"]);
            dispatch({ type: "setMatch", data: data["match"] })
        }

        if (state["matches"].length < 1 || typeof currentMatch["match_id"] === "undefined")
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
                </>
            }

            {
                typeof currentMatch["match_id"] !== "undefined" && typeof state["user"]["user_id"] !== "undefined"
                    ?
                    <>
                        <Grid item xs={4}><BetMatchCoin /></Grid>
                        <Grid item xs={4}><BetMatchTeam teamOneName={currentMatch["teamOne"]["team_fullname"]} teamTwoName={currentMatch["teamTwo"]["team_fullname"]} /></Grid>
                        <Grid item xs={4}><Button variant="contained">Default</Button></Grid>
                    </>
                    :
                    <h3>Please login to place bets</h3>
            }

        </Grid>
    )
}

export default React.memo(IndividualMatchContainer);
