const express = require("express");
const connectDB = require("./config/db");
//core nodejs module to manipulate file paths
const path = require("path");

const app = express();
//Connect to database
connectDB();

//init middleware
app.use(express.json({ extended: false }));

//define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

//SERVE STATIC ASSETS IN PRODUCTION

if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//looks for port env file (for deployment)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
