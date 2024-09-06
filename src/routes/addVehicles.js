const db = require('../persistence');
const {v4 : uuid} = require('uuid');

module.exports = async (req, res) => {
    const item = {
        vehicle_id: req.body.vehicle_id,
        type: req.body.type,
        lock_unlock: req.body.lock_unlock,
        current_speed:req.body.current_speed,
        battery_level:req.body.battery_level,
        status: req.body.status,
        location: req.body.location,
    };

    try {
        await db.addVehicles(item);
        res.send(item); 
    }   
    catch(err){
        res.status(422).send(''); 
    }
    
};
