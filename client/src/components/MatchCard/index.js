import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

const useStyles = makeStyles(({ spacing, palette }) => {
	const family =
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'";
	return {
		card: {
			display: "flex",
			margin: spacing(2),
			padding: spacing(2),
			minWidth: 288,
			borderRadius: 12,
			boxShadow: "0 2px 4px 0 rgba(138, 148, 159, 0.2)",
			"& > *:nth-child(1)": {
				marginRight: spacing(2)
			},
			"& > *:nth-child(2)": {
				flex: "auto"
			}
		},
		avatar: {
			height: "100px",
			width: "100px"
		},
		heading: {
			fontFamily: family,
			fontSize: 16,
			marginBottom: 0
		},
		subheader: {
			fontFamily: family,
			fontSize: 14,
			color: palette.grey[600],
			marginBottom: 4
		},
		value: {
			marginRight: 10,
			marginLeft: 10,
			fontSize: 14,
			color: palette.grey[500]
		},
		emptyLink: {
			textDecoration: "none"
		}
	};
});

const useSliderStyles = makeStyles(() => ({
	root: {
		height: 4
	},
	rail: {
		borderRadius: 10,
		height: 4,
		backgroundColor: "rgb(202,211,216)"
	},
	track: {
		borderRadius: 10,
		height: 4,
		backgroundColor: "rgb(117,156,250)"
	},
	thumb: {
		display: "none"
	}
}));

const MatchCard = ({ match }) => {
	const styles = useStyles();
	const sliderStyles = useSliderStyles();

	return (
		<Link to={`/matches/${match["match_id"]}`} className={styles.emptyLink}>
			<Card className={styles.card} elevation={0}>
				<Avatar src={`http://localhost:3003/img/teams/${match["teamOne"]["team_id"]}.png`} className={styles.avatar} />
				<Box style={{ textAlign: "center" }}>
					<h3 className={styles.heading}>
						{match["teamOne"]["team_fullname"]} v.s {match["teamTwo"]["team_fullname"]}
					</h3>
					<Tooltip title={match["match_datetime"]}>
						<p className={styles.subheader}>{format(match["match_datetime"])}</p>
					</Tooltip>
					<Box display={"flex"} alignItems={"center"}>
						<span className={styles.value}>{match["teamOne"]["team_odds"]}x</span>
						<Slider classes={sliderStyles} defaultValue={50} value={match["match_percentage"]} disabled />
						<span className={styles.value}>{match["teamTwo"]["team_odds"]}x</span>
					</Box>
				</Box>
				<Avatar src={`http://localhost:3003/img/teams/${match["teamTwo"]["team_id"]}.png`} className={styles.avatar} />
			</Card>
		</Link>
	);
};

MatchCard.whyDidYouRender = true;
export default React.memo(MatchCard);
