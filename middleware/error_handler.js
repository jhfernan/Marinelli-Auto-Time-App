'use strict';

const createNewError = (status, message) => {
	let err = new Error(message);
	err.status = status;
	return err;
};

const mongooseError = (mongooseError) => {
	switch(mongooseError.code) {
		case 11000:
			return createNewError(400, 'You have a double entry - for example, trying to use a email already in use');
			break;
		default: return createNewError(400, mongooseError.message);
	}
	return response;
};

module.exports.createNewError = createNewError;
module.exports.mongooseError = mongooseError;
