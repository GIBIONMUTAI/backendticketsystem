const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/database.config.js');
const PORT = 8000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Ticket Management System." });
});

require('./app/routes/ticket.routes.js')(app);


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});