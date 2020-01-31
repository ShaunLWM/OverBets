import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import fetch from "node-fetch";
import React, { useContext, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useDeepCompareEffect from "use-deep-compare-effect";
import socket from "../../lib/useSocket";
import useTokenState from "../../lib/useTokenState";
import { store } from "../../store";
import BetMatchCoin from "../BetMatchCoin";
import BetMatchTeam from "../BetMatchTeam";
import MatchBets from "../MatchBets";
import MatchCard from "../MatchCard";

function IndividualMatchContainer() {
    const { state, dispatch } = useContext(store);
    const { matchId } = useParams();
    const [currentMatch, setCurrentMatch] = useState({});
    const [betCurrentTeam, setBetCurrentTeam] = useState("0");
    const [userToken] = useTokenState("");
    const betInputAmount = useRef();

    useDeepCompareEffect(() => {
        async function fetchMatch() {
            const matches = await fetch(`http://localhost:3001/matches/${matchId}`);
            const data = await matches.json();
            if (!data.success) return console.log(data.msg);
            setCurrentMatch(data["match"]);
            dispatch({ type: "setMatch", data: data["match"] })
        }
        if (state["matches"].length < 1) // TODO: What if totally no match at all?
            fetchMatch();
        else
            setCurrentMatch(state["matches"].find(match => match.match.match_id === Number(matchId)));
    }, [state["matches"], matchId]);

    const handleBetClick = () => {
        const userCurrentCoins = state["user"]["user_coins"];
        if (typeof userCurrentCoins === "undefined") return;
        const coins = Number(betInputAmount.current.value);
        if (isNaN(coins)) return;
        if (userCurrentCoins < coins) return;
        socket.emit("match:bet:new", { token: userToken, coins, matchId: Number(matchId), side: Number(betCurrentTeam) })
    }

    const handleTeamChange = value => setBetCurrentTeam(value);
    return (
        <Grid container justify="center">
            {typeof currentMatch["match"] !== "undefined"
                &&
                <>
                    <Grid item xs={12} sm={12} md={6} ><MatchCard match={currentMatch["match"]} key={currentMatch["match"]["match_id"]} /></Grid>
                    <Grid item xs={12} sm={12} md={6} ><MatchBets users={currentMatch["users"]} /></Grid>
                </>
            }

            {
                typeof currentMatch["match"] !== "undefined" && typeof state["user"]["user_id"] !== "undefined"
                    ?
                    <>
                        <Grid container item xs={12} sm={12} md={6}>
                            <Grid item xs={4} sm={4}><BetMatchCoin ref={betInputAmount} /></Grid>
                            <Grid item xs={4} sm={4}><BetMatchTeam handleTeamChange={handleTeamChange} teamOneName={currentMatch["match"]["teamOne"]["team_fullname"]} teamTwoName={currentMatch["match"]["teamTwo"]["team_fullname"]} /></Grid>
                            <Grid item xs={4} sm={4}><Button variant="contained" onClick={handleBetClick}>Bet</Button></Grid>
                        </Grid>
                        <Grid container item xs={12} sm={12} md={6}>
                            Chat Section/Head to head
                            </Grid>
                    </>
                    :
                    <h3>Please login to place bets</h3>
            }

        </Grid>
    )
}

export default React.memo(IndividualMatchContainer);
