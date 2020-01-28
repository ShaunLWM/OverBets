import React from "react";
import BetsAvatar from "../BetsAvatar";
import BetsCoins from "../BetsCoins";

function BetsContainer(props) {
    return (
        <div style={{ position: "relative", overflow: "visible", textAlign: "center", margin: "0 auto" }}>
            <BetsAvatar {...props} />
            <BetsCoins {...props} />
        </div>
    );
}

export default React.memo(BetsContainer);
