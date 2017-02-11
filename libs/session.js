const protocol = require('./protocol');

let login = (user_id, user_pw) => {
	return new Promise((resolve, reject) => {
		let body = {
			con_key: '7ce98775b1846ff23aef',
			token_verify: 'login'
		};
		let cookie;

		protocol.post(protocol.API.token, body, {
			'X-Requested-With': 'XMLHttpRequest',
		}).then(({body, res}) => {
			if (parseInt(body.msg) !== 5) reject(body);
			let con_key = body.data;
			let form = {
				id_chk: 'on',
				user_id,
				user_pw,
				con_key,
				r_url: 'm.dcinside.com%2Findex.php',
			};
			return protocol.post(protocol.API.login, form);
		}, err => {
			reject(err);
		}).then(({body, res}) => {
			cookie = res.headers['set-cookie'].join('').match(/(dc_m_login=.+?;)/)[1];
			return protocol.post(protocol.API.login2, {
				user_id,
				user_pw
			});
		}, err => {
			reject(err);
		}).then(({body, res}) => {
			if (!(body instanceof Array)) reject(body);
			if (body[0].hasOwnProperty('result') && JSON.parse(body[0].result.toString().toLowerCase()) === false) reject(body[0]);
			body[0].type = 'login';
			body[0].cookie = cookie;
			resolve(body[0]);
		}, err => {
			reject(err);
		});
	})
};

module.exports = {
	login
};
