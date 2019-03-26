var fs = require("fs");
var dataJson = fs.readFileSync(__dirname + "/../config/area-data.json");
var data = JSON.parse(dataJson);
var utf8 = require('utf8');
var path = require("path");
var excel = require('excel4node');
var nodemailer = require('nodemailer');

// var fileSend = require("./fileSend.js");
// getUserData(token, refDb);


// function getUserData(token, refDb) {
// 	sqlUpdateRequest = 'SELECT * FROM users WHERE token = \''.concat(token, '\'');
// 	var args = ["abc", "dede", "ouloulou", "a4pattes"];
// 	refDb.query(sqlUpdateRequest , function (tmperror, tmpres, tmpfields) {
// 		if (tmperror) {
// 			console.log('\x1b[31m', "[MySQL] Error ocurred (SET):", tmperror);
// 		}
// 		else {
// 			fileSend.sendingFile(tmpres, args);
// 			console.log('\x1b[32m', "Github token added sucessfully");
// 		}
// 	});
// }




exports.sendingFile = function(userData, arg) {
	var workbook = new excel.Workbook();
	var worksheet = workbook.addWorksheet('Sheet 1');
	var style = workbook.createStyle({
		font: {
			color: '#FF0800',
			size: 14
		}
	});
	var i = 0;
	
	while (arg[i]) {
		worksheet.cell(1,(i+1)).string(arg[i]).style(style);
		i++;
	}
	workbook.write('data.xlsx');
	sendMail(userData[0].email);
}

function sendMail(userMail) {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		       user: 'arealyon18@gmail.com',
		       pass: 'samthol69'
		   }
	});
	const mailOptions = {
		from: 'deladourig@gmail.com',
		// to: userMail,
		to: 'florian.giroud@epitech.eu',
		subject: 'Area',
		html: 'Area informations',
		attachments: [
			{
				path: 'data.xlsx'
			}
		]
	};
	transporter.sendMail(mailOptions, function (err, info) {
		if(err)
		  console.log(err)
		else
		  console.log(info);
	});
}