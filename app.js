const express= require('express');

const routes=require('./routes/index');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerSpec.js'); 

const authenticateToken = require('./helpers/authenticate');

const app=express();


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(authenticateToken);


app.use(express.json());
app.use('/api',routes);


const port=process.env.PORT;
app.listen(port, () => console.log("Served started "));



