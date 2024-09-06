const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || '/tmp/vehicle.db';

let db, dbAll, dbRun;

function init() {
    const dirName = require('path').dirname(location);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    return new Promise((acc, rej) => {
        db = new sqlite3.Database(location, err => {
            if (err) return rej(err);

            if (process.env.NODE_ENV !== 'test')
                console.log(`Using sqlite database at ${location}`);

            db.run(
                `CREATE TABLE IF NOT EXISTS vehicles (
                    id INTEGER primary key autoincrement,  
                    vehicle_id INTEGER NOT NULL UNIQUE,  
                    type VARCHAR(255) NOT NULL,
                    lock_unlock CHECK( lock_unlock IN ('Lock','Unlock') ) NOT NULL, 
                    current_speed SMALLINT NOT NULL,
                    battery_level SMALLINT NOT NULL,
                    status CHECK( status IN ('PARKING','MOVING','IDLING','TOWING') ) NOT NULL,
                    location VARCHAR(255) NOT NULL,
                    last_updated TEXT NOT NULL DEFAULT current_timestamp
                )
                `,
                (err, result) => {
                    if (err) return rej(err);
                    acc();
                },
            );
        });
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        db.close(err => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getVehicles() {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM vehicles', (err, rows) => {
            if (err) return rej(err);
            acc(rows);
        });
    });
}



async function addVehicles(item) {
    return new Promise((acc, rej) => {
        db.run(
            'INSERT INTO vehicles (vehicle_id, type,lock_unlock,current_speed,battery_level,status,location) VALUES (?, ?, ?,?,?,?,?)',
            [item.vehicle_id, item.type , item.lock_unlock, item.current_speed, item.battery_level, item.status, item.location],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}


module.exports = {
    init,
    teardown,
    getVehicles,
    addVehicles,
};
