import dotenv from "dotenv"
dotenv.config()
import "reflect-metadata";
import express from "express"
import cluster, { Worker } from "cluster"
import { cpus } from "os"
import { useExpressServer } from "routing-controllers"
import "./controller/UserController";
import morgan from "morgan"
import Connection from "./database/connection";
import cors from "cors"

if (false) {
    let numCpus = cpus().length
    for (let i = 0; i < numCpus; i++) {
        cluster.fork()
    }
    cluster.on('exit', (worker: Worker, code) => {
        console.log(`Worker ${worker.process.pid} exited with code ${code}`);
        console.log('Fork new worker!');
        cluster.fork();
    });
} else {
    const app = express()
    const port = process.env.PORT
    const corsOptions: cors.CorsOptions = {
        origin: "*", 
        methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], 
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, 
      }
    app.use(cors(corsOptions))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    useExpressServer(app)
    app.use(morgan("dev"))

    Connection.init()

    app.listen(port, () => {
        console.log(`listening to port ${port}`)
    })

    app.on("error", (error: any) => {
        var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
        if (error.syscall !== 'listen') throw error;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                console.error(error);
        }
    })
}