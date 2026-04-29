import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { Express } from 'express';
const app = express();
const NODE_ENV:string = "dev"
const PORT:number = 4000
app.use(express.json());
// app.use(morgan(NODE_ENV));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(cookieParser());


export const startServer = async (application: Express) => {
    application.listen(PORT, async () => {
      console.log('Server running on port: ' + PORT + ' on ' + NODE_ENV + ' environment');
      await connectToDatabase();
    });
};
export const connectToDatabase = async () => {
  try {
   
    console.log('Successfully connected to DB');
  } catch (error) {
    console.error('Could not connect to DB', error);
  }
};

startServer(app);

export default app;
   