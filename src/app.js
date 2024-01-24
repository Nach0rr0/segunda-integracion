import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import IndexRouter from "./routes/index.routes.js";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", "src/views");
app.set("view engine", "handlebars");

app.use((req, res, next) => {
	req.io = io;
	next();
});

app.use("/", IndexRouter);

const server = app.listen(PORT, (error) => {
	if (error) {
		console.log(error);
	}

	console.log(`Se logro conectar el servidor:${PORT} `);
});

const io = new Server(server);

io.on("connection", (socket) => {
	console.log("Se conecto un nuevo ususario");
});

startMongoConnection()
	.then(() => {
		console.log("Se logro conectar a la base de datos");
	})
	.catch((err) => console.log(err));

async function startMongoConnection() {
	await mongoose.connect(MONGO_URI);
}
