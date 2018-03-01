const figlet = require('figlet'); //require que importa figlet y chalk para poder usarlos
const chalk = require('chalk');

const colorize = (msg,color) => {
	if(typeof color !== "undefined") {
		msg = chalk[color].bold(msg);
	}
	return msg;
};
const log = (msg,color) => {
	console.log(colorize(msg,color));
};
const biglog = (msg,color) => {
	log(figlet.textSync(msg,{horizontalLayout: 'full'}),color);
};
const errorlog = (emsg) => {
	console.log(`${colorize("Error","red")}: ${colorize(colorize(emsg,"red"),"bgYellowBright")}`);
};

exports = module.exports = { //forma alternativa de exportar en vez de poner exports delante de cada funcion
	colorize,
	log,
	biglog,
	errorlog
};