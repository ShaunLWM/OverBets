import Card from "@material-ui/core/Card";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { getRandomColor } from "../../lib/Helper";
import BetsContainer from "../BetsContainer";

const useStyles = makeStyles(({ spacing, breakpoints }) => {
    return {
        card: {
            display: "flex",
            margin: spacing(2),
            padding: spacing(2),
            minWidth: 288,
            borderRadius: 12,
            boxShadow: "0 2px 4px 0 rgba(138, 148, 159, 0.2)",
        },
        subcard: {
            [breakpoints.down("xs")]: {
                "& > *:nth-child(n+4)": {
                    display: "none",
                },
            },
        }
    };
});

const MatchBets = ({ users = [] }) => {
    console.log(`There are ${users.length} users`);
    const styles = useStyles();
    const [betPlayers, setBetPlayers] = useState([]);

    useEffect(() => {
        setBetPlayers(users.map((user) => {
            return {
                name: user.user_battletag,
                img: user.user_image,
                coins: user.bet_amount,
                color: getRandomColor()
            }
        }));
    }, [users]);

    return (
        <Card className={styles.card} elevation={0}>
            <Grid container spacing={3} className={styles.subcard}>
                {betPlayers.map(player => <BetsContainer key={player.name} {...player} />)}
            </Grid>
        </Card>
    );
};

MatchBets.whyDidYouRender = true;
export default React.memo(MatchBets);
