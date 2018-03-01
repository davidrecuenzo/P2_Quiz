
const fs = require ("fs");
const DB_FILENAME = "quizzes.json"; //nombre del fichero donde se guardan las preguntas

let quizzes = [
{
	question:"Capital de Italia",
	answer:"Roma"
},
{
	question: "Capital de Francia",
	answer: "París"
},
{
	question: "Capital de España",
	answer: "Madrid"
},
{
	question: "Capital de Portugal",
	answer: "Lisboa"
}
];

const load = () => { //funcion para leer el fichero
		fs.readFile(DB_FILENAME, (err,data) => {
			if(err){							//si no existe
				if(err.code === "ENOENT"){
					save();   //escribe el fichero con lo que haya en quizzes
					return;
				}
				throw err;
			}
			let json = JSON.parse(data);  //se cogen los datos que se acaban de leer
			if(json){
				quizzes = json;     //se mete en quizzes
			}

		});
};

const save = () => {
	fs.writeFile(DB_FILENAME,   //escribe un fichero
		JSON.stringify(quizzes),  //da una cadena de caracteres
		err => {
			if (err) throw err;
		});
};

exports.count = () => quizzes.length;
exports.add = (question,answer) => {
	quizzes.push({					//push introduce nuevos objetos en el array
		question:(question || "").trim(), //trim quita espacios por delante y por detras
		answer:(answer || "").trim()  // || se pone por si queda vacio
	});
	save();
};

exports.update = (id,question,answer)=> {
	const quiz = quizzes[id];
	if(typeof quiz === "undefined"){
		throw new Error('El valor del parametro id no es valido.');
	}
	quizzes.splice(id,1,{ // splice cambia en la posicion 'id' del array, '1' objeto, por el valor a continuacion
		question:(question || "").trim(),
		answer: (answer || "").trim()
	});
	save();  //para guardar el fichero despues de las modificaciones
};

exports.getAll = () => JSON.parse(JSON.stringify(quizzes)); //devuelve todos los elementos del array

exports.getByIndex = id =>{
	const quiz = quizzes[id];
	if (typeof quiz === "undefined") {
		throw new Error('El valor del parametro id no es valido')
	}
	return JSON.parse(JSON.stringify(quiz));
};

exports.deleteByIndex = id => {
	const quiz = quizzes[id];
	if (typeof quiz === "undefined") {
		throw new Error('El valor del parametro id no es valido')
	}
	quizzes.splice(id,1);
	save();  //despues de borrarlo se salva completo 
};


load();  //carga los quizzes almacenados en el fichero para que se actualice
