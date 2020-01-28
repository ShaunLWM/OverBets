import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { getRandomColor, getRandomInt } from "../../lib/Helper";
import BetsContainer from "../BetsContainer";

const useStyles = makeStyles(({ spacing, palette }) => {
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


const KanbanCard = ({ className }) => {
    const styles = useStyles();
    const [demoPlayers, setDemoPlayers] = useState([])

    useEffect(() => {
        setDemoPlayers(new Array(getRandomInt(1, 8)).fill("").map(() => {
            return {
                img: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/80/80683e910ec2b00eb8903009b08a755e65d94349_full.jpg",
                coins: 100,
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


export default KanbanCard;
