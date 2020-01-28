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
