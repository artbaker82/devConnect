const express = require("express");

//looks for port env file (for deployment)

const app = express();

app.get('/', (req,res) => res.send('API running'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`))

