'use strict';

let request  = require('request');
let toOption = (obj, json = true) => Object.assign(obj, {
	headers,
	json,
	gzip: true,
});

const API    = require('./api-protocol');
const headers = {
	'User-Agent': "Linux Android",
	'Referer': "http://m.dcinside.com",
	'Accept-Encoding': 'gzip, deflate',
	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
};

let post = (api, body, header = {}, json = true) => {
	let option = toOption({
		url: api,
		headers: Object.assign(headers, header),
		formData: body
	}, json);

	return new Promise((resolve, reject) => {
		request.post(option, (err, res, body) => {
			if (err) reject(err);
			resolve({body, res});
		});
	});
};

module.exports = {
	post,
	API,
};
