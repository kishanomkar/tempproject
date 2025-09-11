import express from 'express'
import morgan from 'morgan'
import connect from './db/db.js';
import router from './routes/police.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
connect();

const app = express(); 
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true                 
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/police',router)

 
app.get('/',(req,res)=>{
    res.send("Hellow From Gaurdian")
})

export default app