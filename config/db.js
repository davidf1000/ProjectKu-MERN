// Connect ke DB atlas , dipakai di server.js

const mongoose = require('mongoose');
const config = require('config');
// const db = config.get('MongoURI');
const db = process.env.MongoURI||config.get('MongoURI');
const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});

		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};
// connectDB();

module.exports = connectDB;
