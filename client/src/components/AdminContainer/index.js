import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
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
    const [matchStatus, setMatchStatus] = useState([]);

    useEffect(() => {
        async function fetchMatches() {
            const matches = await fetch("http://localhost:3001/matches");
            const data = await matches.json();
            setMatchStatus(data.map(m => m.match.match_status));
            setCurrentMatches(data);
        }

        fetchMatches();
    }, []);

    const handleDistributeCoins = async () => {

    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">id</TableCell>
                            <TableCell align="center">time</TableCell>
                            <TableCell align="center">teamone</TableCell>
                            <TableCell align="center">teamtwo</TableCell>
                            <TableCell align="center">odds</TableCell>
                            <TableCell align="center">action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentMatches.map((row, i) => (
                            <TableRow key={row.match.match_id}>
                                <TableCell component="th" scope="row" align="center">
                                    {row.match.match_id}
                                </TableCell>
                                <TableCell align="center">{format(row.match.match_unix * 1000)}</TableCell>
                                <TableCell align="center">{row.match.teamOne.team_fullname}</TableCell>
                                <TableCell align="center">{row.match.teamTwo.team_fullname}</TableCell>
                                <TableCell align="center">{row.match.teamOne.team_odds} ({row.match.teamOne.team_total}) / {row.match.teamTwo.team_odds} ({row.match.teamTwo.team_total})</TableCell>
                                <TableCell align="center">
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={matchStatus[i]}
                                            onChange={(e) => {
                                                console.log(`new value ${e.target.value}`);
                                                let arr = [...matchStatus];
                                                arr[i] = e.target.value;
                                                setMatchStatus(arr);
                                            }}
                                        >
                                            <MenuItem value={"MATCH_OPEN"}>MATCH_OPEN</MenuItem>
                                            <MenuItem value={"MATCH_ONGOING"}>MATCH_ONGOING</MenuItem>
                                            <MenuItem value={"MATCH_CLOSED"}>MATCH_CLOSED</MenuItem>
                                            <MenuItem value={"MATCH_ENDED"}>MATCH_ENDED</MenuItem>
                                            <MenuItem value={"MATCH_RETURNED"}>MATCH_RETURNED</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button size="small" variant="contained" disabled={matchStatus[i] !== "MATCH_ENDED"} onClick={handleDistributeCoins}>Default</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
