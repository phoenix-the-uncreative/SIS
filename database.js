const mysql = require('mysql');
const fs = require('fs');

let config = JSON.parse(fs.readFileSync('config.json', (err, data) => {
	config = data;
}));

let sqlPool = mysql.createPool({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});

exports.connection = {
    query: function() {
		var queryArgs = Array.prototype.slice.call(arguments),
			events = [],
			eventNameIndex = {};

		sqlPool.getConnection(function (err, conn) {
			if (err)
				if (eventNameIndex.error)
					eventNameIndex.error();
			if (conn) {
				var q = conn.query.apply(conn, queryArgs);
				q.on('end', () => conn.release());

				events.forEach(args => q.on.apply(q, args));
			}
		});

		return {
			on: function (eventName, callback) {
				events.push(Array.prototype.slice.call(arguments));
				eventNameIndex[eventName] = callback;
				return this;
			}
		};
	}
};