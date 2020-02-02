import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import fetch from "node-fetch";
import React, { useContext, useEffect, useState } from "react";
import { format } from "timeago.js";
import { store } from "../../store";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


export default function AdminContainer() {
    const classes = useStyles();
    const { state, dispatch } = useContext(store);
    const [currentMatches, setCurrentMatches] = useState([]);

    useEffect(() => {
        async function fetchMatches() {
            const matches = await fetch("http://localhost:3001/matches");
            const data = await matches.json();
            setCurrentMatches(data);
        }

        fetchMatches();
    }, []);

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Dessert (100g serving)</TableCell>
                            <TableCell align="right">Calories</TableCell>
                            <TableCell align="right">Fat&nbsp;(g)</TableCell>
                            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                            <TableCell align="right">Protein&nbsp;(g)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentMatches.map(row => (
                            <TableRow key={row.match.match_id}>
                                <TableCell component="th" scope="row">
                                    {row.match.match_id}
                                </TableCell>
                                <TableCell align="right">{format(row.match.match_unix)}</TableCell>
                                <TableCell align="right">{row.match.teamOne.team_name}</TableCell>
                                <TableCell align="right">{row.match.teamTwo.team_name}</TableCell>
                                <TableCell align="right">{row.match.teamOne.match_odds}/{row.match.teamTwo.match_odds}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
