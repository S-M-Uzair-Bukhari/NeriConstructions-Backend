const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5020;

const connectDB = require("./db/connectDB");
const path = require("path");

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Neri Construction's Bakend");
});

app.use("/",
  express.static( path.resolve(__dirname,"./public/image/"))
);

app.use("/",
  express.static( path.resolve(__dirname, "./public/employeeImage/"))
);

app.use("/",
  express.static( path.resolve(__dirname, "./public/pdf/"))
);

app.use("/api", require("./routes/admin"));
app.use("/api", require("./routes/employee"));
app.use("/api", require("./routes/attendance"));
app.use("/api", require("./routes/otp"));
app.use("/api", require("./routes/task"));
const start = () => {
  try {
    connectDB();
    server.listen(PORT, () => {
        console.log(`Server is Running on PORT: ${PORT}`);
    })
  } catch (error) {
    console.log(`Having Errors Running On Port ${5000}`)
  }  
};

start();