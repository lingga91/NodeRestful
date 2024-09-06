const express = require('express');
const app = express();
const db = require('./persistence');
const getVehicles = require('./routes/getVehicles');
const addVehicles = require('./routes/addVehicles');

app.use(express.json());
app.get('/vehicles', getVehicles);
app.post('/vehicles', addVehicles);

db.init().then(() => {
    app.listen(3000, () => console.log('Listening on port 3000'));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
