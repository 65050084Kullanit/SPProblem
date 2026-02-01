const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// REST API
app.use("/api/avatars", require("./routes/api/avatars"));

// Socket
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  require("./routes/socket/join")(socket);
});

app.get("/", (_, res) => res.send("Server is running"));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
