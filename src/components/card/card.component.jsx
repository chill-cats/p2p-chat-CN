import React from "react";
import './card.component.css'
function Card(props){
    const user = props.user;
    return(
        <div className="card_info">
            <img id = "avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSriFFJXaLLV3g1bFT8PrDRFbD50XjQ7lm_0g&usqp=CAU" alt="avatar of user" />
            <h5>{user.name}</h5>

        </div>
    )
}
export default Card;