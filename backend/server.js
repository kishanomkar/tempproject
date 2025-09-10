import dotenv from "dotenv";
dotenv.config();

import http from "http"
import app from "./police_dashboard/app.js"

const police_server = http.createServer(app)
const police_port = process.env.POLICE_PORT || 3000

police_server.listen(police_port,()=>{
    console.log(`Server is running on port ${police_port}`);
}) 