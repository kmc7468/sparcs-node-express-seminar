const mongoose = require("mongoose");

const OSchemaDefinition = {
	username: String,
	total: {
		type: Number,
		default: 10000
	}
};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const AccountModel = mongoose.model("account", schema);

module.exports = AccountModel;

