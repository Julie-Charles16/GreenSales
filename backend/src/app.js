const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", require("./routes/authRoute"));
app.use("/api/user", require("./routes/userRoute"));
app.use("/clients", require("./routes/clientRoute"));
app.use("/appointments", require("./routes/appointmentRoute"));
app.use("/sales", require("./routes/saleRoute"));

app.get("/", (req, res) => {
  res.send("API GreenSales OK");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});