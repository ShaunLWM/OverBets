import AppBar from "@material-ui/core/AppBar";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import MoreIcon from "@material-ui/icons/MoreVert";
import NotificationsIcon from "@material-ui/icons/Notifications";
import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import useTokenState from "../../lib/useTokenState";
import { store } from "../../store";

const useStyles = makeStyles(theme => ({
	grow: {
		flexGrow: 1
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		display: "block",
		color: "white"
	},
	sectionDesktop: {
		display: "none",
		[theme.breakpoints.up("md")]: {
			display: "flex"
		}
	},
	sectionMobile: {
		display: "flex",
		[theme.breakpoints.up("md")]: {
			display: "none"
		}
	}
}));

function NavigationBar() {
	const classes = useStyles();
	const history = useHistory();
	const [anchorEl, setAnchorEl] = useState(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

	const { state, dispatch } = useContext(store);
	const [currentProfile, setCurrentProfile] = useState(state["user"]);
	const [userToken, setUserToken] = useTokenState("");

	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	useEffect(() => {
		setCurrentProfile(state["user"]);
	}, [state["user"]]);

	const handleProfileMenuOpen = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMenuClose = (loc = "") => {
		setAnchorEl(null);
		handleMobileMenuClose();
		if (loc.length > 0) history.push(loc);
	};

	const handleLogout = () => {
		setUserToken("");
		handleMenuClose();
	};

	const handleMobileMenuOpen = event => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const menuId = "primary-search-account-menu";
	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			id={menuId}
			keepMounted
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isMenuOpen}
			onClose={handleMenuClose}>
			<MenuItem onClick={() => handleMenuClose("/me")}>Profile</MenuItem>
			<MenuItem onClick={handleMenuClose}>My account</MenuItem>
			<Divider />
			<MenuItem onClick={handleLogout}>Logout</MenuItem>
		</Menu>
	);

	const mobileMenuId = "primary-search-account-menu-mobile";
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}>
			<MenuItem>
				<IconButton aria-label="show 4 new mails" color="inherit">
					<Badge badgeContent={4} color="secondary">
						<MailIcon />
					</Badge>
				</IconButton>
				<p>Messages</p>
			</MenuItem>
			<MenuItem>
				<IconButton aria-label="show 11 new notifications" color="inherit">
					<Badge badgeContent={11} color="secondary">
						<NotificationsIcon />
					</Badge>
				</IconButton>
				<p>Notifications</p>
			</MenuItem>
			<MenuItem>
				<Typography variant="caption" noWrap>
					{currentProfile["user_coins"]}c
				</Typography>
			</MenuItem>
			<MenuItem onClick={handleProfileMenuOpen}>
				<IconButton aria-label="account of current user" aria-controls="primary-search-account-menu" aria-haspopup="true" color="inherit">
					<AccountCircle />
				</IconButton>
				<p>Profile</p>
			</MenuItem>
		</Menu>
	);

	return (
		<div className={classes.grow}>
			<AppBar position="static">
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="open drawer">
						<MenuIcon />
					</IconButton>
					<Link style={{ textDecoration: "none" }} to="/">
						<Typography className={classes.title} variant="h6" noWrap>
							OverBets
						</Typography>
					</Link>
					<div className={classes.grow} />
					<div className={classes.sectionDesktop}>
						{typeof currentProfile["user_id"] === "undefined" || userToken.length === 0 ? (
							<Button color="inherit" onClick={() => (window.location = "http://localhost:3003/auth/bnet")}>
								Login
							</Button>
						) : (
							<>
								<IconButton aria-label="show 4 new mails" color="inherit">
									<Badge badgeContent={4} color="secondary">
										<MailIcon />
									</Badge>
								</IconButton>
								<IconButton aria-label="show 17 new notifications" color="inherit">
									<Badge badgeContent={17} color="secondary">
										<NotificationsIcon />
									</Badge>
								</IconButton>
								<MenuItem>
									<Typography variant="caption" noWrap>
										{currentProfile["user_coins"]}c
									</Typography>
								</MenuItem>
								<IconButton
									edge="end"
									aria-label="account of current user"
									aria-controls={menuId}
									aria-haspopup="true"
									onClick={handleProfileMenuOpen}
									color="inherit">
									<AccountCircle />
								</IconButton>
							</>
						)}
					</div>
					{typeof currentProfile["user_id"] === "undefined" || userToken.length === 0 ? (
						<Button className={classes.sectionMobile} color="inherit" onClick={() => (window.location = "http://localhost:3003/auth/bnet")}>
							Login
						</Button>
					) : (
						<div className={classes.sectionMobile}>
							<IconButton aria-label="show more" aria-controls={mobileMenuId} aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
								<MoreIcon />
							</IconButton>
						</div>
					)}
				</Toolbar>
			</AppBar>
			{renderMobileMenu}
			{renderMenu}
		</div>
	);
}

NavigationBar.whyDidYouRender = true;
export default React.memo(NavigationBar);
