require("dotenv").config();
const cors = require("cors");
const express = require("express");

// routers
//! const authCompagnyRouter = require('./routes/authCompagniesRoutes.js');
const authUserRouter = require("./routes/authUsersRoutes.js");
const roleRouter = require("./routes/rolesRoutes.js");
const compagnyRouter = require("./routes/compagniesRoutes.js");
const eventRouter = require("./routes/eventsRoutes.js");
const jobRouter = require("./routes/jobsRoutes.js");
const trainingRouter = require("./routes/trainingsRoutes.js");
const userRouter = require("./routes/usersRoutes.js");
const { errorHandler } = require("./errors/errorHandler.js");

const app = express();

app.use(cors());
app.use(express.json());

// route
app.use("/api/v1/auth", authUserRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/compagnies", compagnyRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/trainings", trainingRouter);
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
	res.json(`Bienvenue sur l'API d'${process.env.DATABASE_NAME}`);
});

app.use(errorHandler);

app.listen(process.env.API_PORT || 5000, () => {
	console.log(
		`L'API ${process.env.DATABASE_NAME} tourne sur le port ${
			process.env.API_PORT || 5000
		} et la BDD sur le port ${process.env.DATABASE_PORT || 5432}`
	);
});
