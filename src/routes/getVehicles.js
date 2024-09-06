const db = require('../persistence');

module.exports = async (req, res) => {
    const items = await db.getVehicles();
    res.send(items);
};
