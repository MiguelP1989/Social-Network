import React, { useEffect, useState } from "react";
import axios from "./axios";

export function Friendshipbutton({ otherId }) {
    console.log("otherId in friendship button: ", otherId);
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        console.log("button mounted!!", otherId);
        axios.get(`/friendshipstatus/${otherId}`).then(resp => {
            console.log("response from friendshipstatus:", resp.data);

            setButtonText(resp.data.buttonText);
        });
    }, []);

    function submit() {
        if (buttonText == "Make a friendship request") {
            console.log("clicked on the button..", buttonText);
            axios.post(`/friendRequest/${otherId}`).then(resp => {
                console.log("results in request friendship, ", resp);

                setButtonText(resp.data.buttonText);
            });
        }
        if (buttonText == "Accept friendship request")
            axios.post(`/acceptFriendRequest/${otherId}`).then(resp => {
                console.log("results in update", resp);
                setButtonText(resp.data.buttonText);
            });

        if (
            buttonText == "End Friendship" ||
            buttonText == "cancel friendship request"
        )
            axios.post(`/deleteRequest/${otherId}`).then(resp => {
                console.log("results in deleteRequest", resp);
                setButtonText(resp.data.buttonText);
            });
        // we can either do the logic here, and send to one of
        // 3 different post routes...
        // or
        // we can make a post request to 1 route, and the route does the
        // logic to determin what type of query to make
    }
    return (
        <div>
            <button className="friendship-button" onClick={submit}>
                {buttonText}
            </button>
        </div>
    );
}
