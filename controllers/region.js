const moment = require('moment');
const Region = require('../models/region');

const createRegion = async (req, res) => {
    const { city } = req.body;

    const region = new Region({ city });
    await region.save();

    res.json(region);
}

const getRegions = async (req, res) => {

    const query = {status: true};

    const [total, regions] = await Promise.all([
        Region.countDocuments(query),
        Region.find(query)
    ]);

    res.json({
        total,
        regions
    });

}

const getRegion = async (req, res)=> {
    const { id } = req.params;

    const region = await Region.findById(id);
    res.json(region);

}

const updateRegion = async (req, res) => {
    const { id } = req.params;
    const { createdAt, updatedAt, _id, status, ...data } = req.body;
    data.updatedAt = moment().unix();

    const region = await Region.findByIdAndUpdate(id, data, {new: true});
    res.json(region);
}

const deleteRegion = async (req, res) => {
    const { id } = req.params;
    
    const region = await Region.findByIdAndUpdate(id, {status: false}, {new: true});
    res.json(region);
}

module.exports = {
    createRegion,
    getRegions,
    getRegion,
    updateRegion,
    deleteRegion
}