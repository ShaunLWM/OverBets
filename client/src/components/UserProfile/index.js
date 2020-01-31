import fetch from "node-fetch";
import React, { useEffect } from "react";

export default function UserProfile() {

    useEffect(() => {
        async function fetchBetsHistory() {
            const results = await fetch("");
        }

        fetchBetsHistory();
    });
    return (
        <>
            <span>Profile page</span>
        </>
    );
}
