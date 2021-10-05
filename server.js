const express = require("express");
const connectDB = require('./config/db')

//looks for port env file (for deployment)

const app = express();
//Connect to database
connectDB();

app.get('/', (req,res) => res.send('API running'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`))

