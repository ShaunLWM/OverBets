import PropTypes from "prop-types";
import React, { createContext } from "react";
import { useImmerReducer } from "use-immer";

const initialState = {
    user: {}
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
