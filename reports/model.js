const mongoose = require("mongoose");

const schema = mongoose.Schema;
const objectId = mongoose.ObjectId;

const ReportSchema = new schema({
    userId: {type: objectId},
    reportReasons: {type: Number}
}, {_id: false});

module.exports = mongoose.model("Report", ReportSchema);