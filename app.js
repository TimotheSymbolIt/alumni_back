require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// middlewares
const notFound = require('./middlewares/notFoundMiddleware.js');
const errorHandler = require('./middlewares/errorHandlerMiddleware.js');

// routers

const authCompagnyRouter = require('./routes/authCompagniesRoutes.js');
const authUserRouter = require('./routes/authUsersRoutes.js');

// const compagnyRouter = require('./routes/compagniesRoutes.js');
// const eventRouter = require('./routes/eventsRoutes.js');
// const jobRouter = require('./routes/jobsRoutes.js');
// const stackRouter = require('./routes/stacksRoutes.js');
// const trainingRouter = require('./routes/trainingsRoutes.js');
// const userRouter = require('./routes/usersRoutes.js');
app.use(express.json());

// route

app.use('/api/v1/authCompagny', authCompagnyRouter);
app.use('/api/v1/authUser', authUserRouter);
// app.use('/api/v1/compagny', compagnyRouter);
// app.use('/api/v1/event', eventRouter);
// app.use('/api/v1/job', jobRouter);
// app.use('/api/v1/stack', stackRouter);
// app.use('/api/v1/training', trainingRouter);
// app.use('/api/v1/user', userRouter);

app.use(notFound);
app.use(errorHandler);

const port = 5000;
app.listen(port, () => console.log(`Server is listening on ${port}...`));
