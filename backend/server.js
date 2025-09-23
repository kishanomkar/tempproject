import dotenv from "dotenv";
dotenv.config();

import http from "http"
import app from "./police_dashboard/app.js"
import touristapp from "./tourist_dashboard/app.js";

const police_server = http.createServer(app)
const police_port = process.env.POLICE_PORT || 3000
const tourist_server = http.createServer(touristapp)
const tourist_port = process.env.TOURIST_PORT || 4000

police_server.listen(police_port,()=>{
    console.log(`Police Server is running on port ${police_port}`);
}) 

tourist_server.listen(tourist_port,()=>{
    console.log(`Tourist Server is running on port ${tourist_port}`);
})