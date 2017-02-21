const protocol     = require('./protocol');
const randomstring = require('randomstring').generate;
const fs		   = require('fs');

let write = (session, gall_id, subject, content, fl_data, ofl_data) => {
	return new Promise((resolve, reject) => {
		let body = {
			id: gall_id,
			w_subject: subject,
			w_memo: content,
			mode: 'write_verify'
		};
		protocol.post(protocol.API.article.token, body).then(({body, res}) => {
			if (parseInt(body.msg) !== 5) {
				reject(body);
				return;
			}
			let form = {
				Block_key:  body.data,
				FL_DATA:    fl_data || '',
				OFL_DATA:   ofl_data || '',
				id:         gall_id,
				memo:       content,
				mode:       'write',
				mobile_key: 'mobile_nomember',
				code: randomstring({
					length: 32,
					charset: 'hex'
				}),
				subject,
			};
			let header = {
				Referer : `http://m.dcinside.com/write.php?id=${gall_id}&mode=write`,
				cookie: session.cookie,
			};
			if (session.type === 'login') {
				form.mobile_key = session.user_no;
				form.user_id = session.user_id;
			} else {
				form.name = session.name;
				form.password = session.password;
			}
			return protocol.post(protocol.API.article.write, form, header, false);
		}, err => {
			reject(err);
		}).then(({body, res}) => {
			let regex = /<meta http-equiv="refresh" content="0; url=http:\/\/m\.dcinside\.com\/view\.php\?id=.+&page=&no=(\d+)">/;
			if (!regex.test(body)) {
				reject({
					result: false,
					cause: '오류',
					body
				});
				return;
			}
			resolve({
				result: true,
				cause: body.replace(regex, '$1')
			});
		}, err => {
			reject(err);
		});
	})
};

let upload = (gall_id, images) => {
	return new Promise((resolve, reject) => {
		if (!gall_id) {
			reject('no gall_id');
			return;
		 }
		if (!(images instanceof Array) || images.length < 1) {
			reject('no images arrays');
			return;
		}
		let form = {
			imgId: gall_id,
			mode: 'write',
			img_num: 11
		};
		let image_idx = 1;
		for (let image of images) {
			if (!fs.existsSync(image)) {
				reject({
					result: false,
					cause: `${image} not found`
				});
				return;
			}
			form[`upload[${image_idx++}]`] = fs.createReadStream(image);
		}
		protocol.post(protocol.API.article.image_upload, form, null, false).then(({body, res}) => {
			body = body.replace(/\s{2,}/g, '');
			let regex = /getElementById\('FL_DATA'\)\.value = '(.+)';parent\.document\.getElementById\('OFL_DATA'\)\.value ='(.+)';/;
			if (!regex.test(body)) {
				reject({
					result: false,
					cause: '오류',
					body
				});
				return;
			}
			resolve({
				result: true,
				fl_data: body.match(regex)[1],
				ofl_data: body.match(regex)[2]
			});
		});
	});
};

module.exports = {
	write,
	upload
};
