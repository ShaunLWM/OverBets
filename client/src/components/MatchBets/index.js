import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { getRandomColor } from "../../lib/Helper";
import PlayerAvatar from "../PlayerAvatar";

const useStyles = makeStyles(({ spacing, palette }) => {
    const family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'";
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
        setDemoPlayers(new Array(8).fill("").map(() => {
            return {
                img: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/80/80683e910ec2b00eb8903009b08a755e65d94349_full.jpg",
                coins: 100,
                color: getRandomColor()
            }
        }));


    }, [])
    return (
        <Card className={styles.card} elevation={0}>
            {
                demoPlayers.map(player => <PlayerAvatar {...player} />)
            }
        </Card>
    );
};


export default KanbanCard;
