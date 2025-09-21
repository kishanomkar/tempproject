import dotenv from "dotenv";
dotenv.config();

import http from "http"
import app from "./police_dashboard/app.js"
import userapp from "./user_dashboard/app.js"

const police_server = http.createServer(app)
const police_port = process.env.POLICE_PORT || 3000
const user_server = http.createServer(userapp)
const user_port = process.env.USER_PORT || 4000

police_server.listen(police_port,()=>{
    console.log(`Police Server is running on port ${police_port}`);
}) 

user_server.listen(user_port,()=>{
    console.log(`User Server is running on port ${user_port}`);
})