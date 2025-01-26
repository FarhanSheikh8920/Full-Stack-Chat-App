import express from 'express';
import cookieParser from 'cookie-parser';
import authroute from './routes/auth.route.js';
import messageroute from './routes/message.route.js';
import dotenv from 'dotenv';
import {app,server} from './lib/socket.js';
import {connetDB} from './lib/db.js';
import cors from 'cors'
import path from 'path';
dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(cors({origin:'http://localhost:5173',credentials: true}))
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());


app.use('/api/auth', authroute);
app.use('/api/message', messageroute);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
  connetDB();
});
