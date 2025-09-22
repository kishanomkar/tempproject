import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import policeRouter from './routes/police.routes.js';
// import touristRouter from './routes/tourist.routes'; 
import cookieParser from 'cookie-parser';
import cors from 'cors';
// import { qrDataStore } from './controller/tourist.controller.js';
// import { getAllTourists } from './services/data.services.js';

connect();

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/police', policeRouter);
// app.use('/tourist', touristRouter); // <-- Add this

// Existing routes here...
// app.get('/get-qr-data', (req, res) => {
//   res.status(200).json({
//     foreignQRData: qrDataStore.foreignQRData,
//     domesticQRData: qrDataStore.domesticQRData,
//   });
// });


app.get('/', (req, res) => {
  res.send("Hello From Guardian");
});

export default app;
