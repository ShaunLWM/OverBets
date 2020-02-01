import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BASE_URL, store } from "../../store";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    clearLink: {
        textDecoration: "none"
    }
});

function UserProfile() {
    const { state, dispatch } = useContext(store);
    const [betHistories, setBetHistories] = useState([]);
    const [hasFetched, setFetched] = useState(false);
    // this is to prevent rerendering when user visits the rofile page ONLY and it renders the navigation bar
    // then rerenders this page again which results in fetching history page twice
    const { tag } = useParams();
    const classes = useStyles();

    useEffect(() => {
        async function fetchBetsHistory() {
            console.log(state);
            let url = `${BASE_URL}/me/`;
            if (typeof tag === "undefined") {
                if (typeof state["user"]["user_battletag"] === "undefined") {
                    return;
                } else {
                    url += encodeURIComponent(state["user"]["user_battletag"]);
                }
            } else {
                url += encodeURIComponent(tag);
            }

            const matches = await fetch(url);
            const data = await matches.json();
            setBetHistories(data.history);
            setFetched(true);
        }

        if (!hasFetched) fetchBetsHistory();
    }, [tag, state]);

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Bet Id</TableCell>
                            <TableCell align="right">Match</TableCell>
                            <TableCell align="right">Team</TableCell>
                            <TableCell align="right">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {betHistories.map(row => (
                            <TableRow key={row.bet_uid}>
                                <TableCell component="th" scope="row">
                                    {row.bet_uid}
                                </TableCell>
                                <TableCell align="right">
                                    <Link className={classes.clearLink} to={`/matches/${row.bet_matchId}`}>{row.bet_matchId}</Link></TableCell>
                                <TableCell align="right">{row.bet_side}</TableCell>
                                <TableCell align="right">{row.bet_amount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default React.memo(UserProfile);
