"use client";

import { useState } from "react";


export default function ChatBox(){

const [message,setMessage] = useState("");
const [isTyping, setIsTyping] = useState(false); // ← thêm state mới

const [messages,setMessages] = useState([
{
role:"ai",
text:"Xin chào 👋 Tôi là Mai, hướng dẫn viên AI Huế."
},
{
role:"ai",
text:"Bạn muốn khám phá địa điểm nào?"
}
]);


async function sendMessage(){

if(!message.trim()) return;


const userMessage = message;


// hiện tin nhắn người dùng
setMessages(prev=>[
...prev,
{
role:"user",
text:userMessage
}
]);


setMessage("");
setIsTyping(true); // ← bật "đang gõ..." trước khi gọi API


try{


const res = await fetch("/api/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

message:userMessage

})

});



const data = await res.json();


// hiện câu trả lời AI
setMessages(prev=>[
...prev,
{
role:"ai",
text:data.answer || "AI chưa có câu trả lời."
}
]);


}

catch(error){

console.log(error);


setMessages(prev=>[
...prev,
{
role:"ai",
text:"Xin lỗi, AI đang gặp lỗi kết nối."
}
]);

}

finally{
setIsTyping(false); // ← tắt "đang gõ..." dù thành công hay lỗi
}


}



return (

<div className="chat-box">


<div className="chat-header">

👩 Mai AI Guide

</div>



<div className="chat-content">

{
messages.map((msg,index)=>(

<div
key={index}
className={
msg.role==="ai"
?"chat-ai"
:"chat-user"
}
>

{msg.text}

</div>

))
}

{
isTyping && (
<div className="chat-ai chat-typing">
<span className="dot"></span>
<span className="dot"></span>
<span className="dot"></span>
</div>
)
}

</div>




<div className="chat-input">


<input

value={message}

onChange={(e)=>setMessage(e.target.value)}

onKeyDown={(e)=>{

if(e.key==="Enter")
sendMessage();

}}

placeholder="Hỏi về Huế..."

disabled={isTyping}

/>



<button onClick={sendMessage} disabled={isTyping}>
➤
</button>


</div>


</div>

)

}