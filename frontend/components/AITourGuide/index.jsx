"use client";

import {useState} from "react";
import ChatBox from "./ChatBox";
import "./guide.css";


export default function AITourGuide(){

const [open,setOpen]=useState(false);


return (

<div className="tour-guide">


{
open &&
<ChatBox/>
}



<img

src="/guide/guide.png"

className="guide-avatar"

onClick={()=>setOpen(!open)}

/>


</div>

)

}