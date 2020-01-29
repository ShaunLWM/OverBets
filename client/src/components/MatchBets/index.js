import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { getRandomAvatar, getRandomColor } from "../../lib/Helper";
import BetsContainer from "../BetsContainer";

const useStyles = makeStyles(({ spacing }) => {
    return {
        card: {
            display: "flex",
            margin: spacing(2),
            padding: spacing(2),
            minWidth: 288,
            borderRadius: 12,
            boxShadow: "0 2px 4px 0 rgba(138, 148, 159, 0.2)",
        }
    };
});


const MatchBets = ({ users = [] }) => {
    const styles = useStyles();
    const [demoPlayers, setDemoPlayers] = useState([]);

    useEffect(() => {
        console.log(users)
        setDemoPlayers(users.map((user) => {
            return {
                name: user.user_battletag,
                img: getRandomAvatar(),
                coins: user.user_coins,
                color: getRandomColor()
            }
        }));
    }, []);

    return (
        <Card className={styles.card} elevation={0}>
            {
                demoPlayers.map(player => <BetsContainer {...player} />)
            }
        </Card>
    );
};


export default MatchBets;
