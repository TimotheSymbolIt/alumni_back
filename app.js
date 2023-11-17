require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');

// Configuration de express-fileupload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

// middlewares
const notFound = require('./middlewares/notFoundMiddleware.js');
const errorHandler = require('./middlewares/errorHandlerMiddleware.js');

// routers
//! const authCompagnyRouter = require('./routes/authCompagniesRoutes.js');
const authUserRouter = require('./routes/authUsersRoutes.js');
const rolesRouter = require('./routes/rolesRoutes.js');
const compagnyRouter = require('./routes/compagniesRoutes.js');
const eventRouter = require('./routes/eventsRoutes.js');
const jobRouter = require('./routes/jobsRoutes.js');
const stackRouter = require('./routes/stacksRoutes.js');
const trainingRouter = require('./routes/trainingsRoutes.js');
const userRouter = require('./routes/usersRoutes.js');
const notificationRouter = require('./routes/notificationsRoutes.js');

app.use(express.json());

// route
app.use('/api/v1/authUser', authUserRouter);
app.use('/api/v1/roles', rolesRouter);
app.use('/api/v1/compagnies', compagnyRouter);
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/stacks', stackRouter);
app.use('/api/v1/trainings', trainingRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/notification', notificationRouter);

app.use(notFound);
app.use(errorHandler);

const port = 5000;
app.listen(port, () => console.log(`Server is listening on ${port}...`));
