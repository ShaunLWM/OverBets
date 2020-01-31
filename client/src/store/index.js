import PropTypes from "prop-types";
import React, { createContext } from "react";
import { useImmerReducer } from "use-immer";

const initialState = {
    user: {},
    /*
        user_battletag: str,
        user_token: str
    */
    matches: [],
    /*
        {
            match_id: int <- this is our internal database id, not owl id
            match_datetime: int,
            teamOne: {
                team_id: int
                team_fullname: str
                team_shortname: str
                team_color: str
            },
            teamTwo: {},
            bets: [
                {
                    user_battletag: str,
                    user_image: str,
                    user_coins: int // number of coins user has bet
                }
            ]
        }
    */
};

const store = createContext(initialState);
const { Provider } = store;

function reducerFunction(draft, action) {
    switch (action.type) {
        case "setUser":
            draft["user"] = action["data"];
            break;
        case "setMatches":
            draft["matches"] = action["data"];
            break;
        case "setMatch":
            const m = action["data"];
            const mid = draft["matches"].findIndex(match => match.match_id === m.match_id);
            if (mid < 0) draft["matches"].push(action["data"]);
            draft["matches"][mid] = action["data"];
            break;
        case "newBets":
            const { match_id, user } = action["data"];
            const matchIndex = draft["matches"].findIndex(match => match.match.match_id === match_id);
            if (matchIndex < 0) return;
            const users = draft["matches"][matchIndex]["users"];
            if (users.length > 5) users.shift();
            users.push(user);
            draft["matches"][matchIndex]["match"]["match_percentage"] = action["data"]["payout"]["percentage"];
            draft["matches"][matchIndex]["match"]["teamOne"]["team_odds"] = action["data"]["payout"]["odds"][0];
            draft["matches"][matchIndex]["match"]["teamTwo"]["team_odds"] = action["data"]["payout"]["odds"][1];
            break;
        case "setProfile":
            draft["user"] = action["data"]["profile"];
            break;
        default:
            draft = initialState;
    }
}

const StateProvider = ({ children }) => {
    const [state, dispatch] = useImmerReducer(reducerFunction, initialState);
    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };

StateProvider.propTypes = {
    children: PropTypes.element,
};
