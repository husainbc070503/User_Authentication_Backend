require('dotenv').config();
const express = require('express');
const connectToDB = require('./db');
const app = express();
const port = process.env.PORT;
const cors = require('cors');

connectToDB();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.send("Hello World"));
app.use('/api/auth', require('./routes/User'));
app.listen(port, () => console.log(`Server running on port ${port}`));