const model = require('./model'); 
const {log,biglog,errorlog,colorize} = require ("./out");

exports.helpCmd = rl => {     //se pone rl
  console.log('Comandos:');
  console.log("h/help -Muestra esta ayuda");
  console.log("list -Lista los quizzes existentes");
  console.log("show <id> -Muestra la pregunta y la respuesta del quiz indicado");
  console.log("add -Añadir un nuevo quiz");
  console.log("delete <id> -Borrar el quizz indicado");
  console.log("edit <id>  -Editar el quizz indicado");
  console.log("p/play -Jugar a preguntar aleatoriamente todos los quizzes");
  console.log("credits -Creditos");
  console.log("q/quit -Salir del programa");
  rl.prompt();
};

exports.editCmd = (rl,id)=> {
if(typeof id === "undefined"){    //en el caso de que no pasen 'id'
   	errorlog('Falta el parametro id');
   rl.prompt();
   } else {
   		try{
   			const quiz = model.getByIndex(id);
   			process.stdout.isTTY && setTimeout(() =>{rl.write(quiz.question)},0); //escribe la pregunta; 0 => no se espera nada
   			rl.question(colorize('Introduzca pregunta','red'),question => {

   				process.stdout.isTTY && setTimeout(() =>{rl.write(quiz.answer)},0);
   		
  				rl.question(colorize('Introduzca respuesta','red'),answer =>{
  				model.update(id,question,answer); // 'question' y 'answer' tienen guardo lo pasado por teclado
  				log(` ${colorize('Se ha cambiado el quiz','magenta')} ${id} : ${question} ${colorize('=>','magenta')} ${answer}`);
  			rl.prompt(); //se saca el prompt al final de todo
  			});
  		});	
   		} catch(error){
   			errorlog(error.mensaje);
   			rl.prompt(); //si el 'id' no es valido
   		}
   }
};
exports.showCmd = (rl,id) => {
   if(typeof id === "undefined"){    //en el caso de que no pasen 'id'
   	errorlog('Falta el parametro id');
   } else {
   		try{
   			const quiz = model.getByIndex(id);  //se accede a la pregunta en posicion 'id'
   			log(` [${colorize(id,'magenta')}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
   		} catch(error){
   			errorlog(error.mensaje); //si el 'id' no es valido
   		}
   }
  rl.prompt();
};
exports.testCmd = (rl,id)=> {
	if(typeof id === "undefined"){    //en el caso de que no pasen 'id'
   	errorlog('Falta el parametro id');
   	rl.prompt();
	} else{
		try{
			const quiz = model.getByIndex(id);
			log(` [${colorize(id,'magenta')}]: ${quiz.question}`);
			rl.question(colorize('Introduzca respuesta :','magenta'),answer => {   
				if(answer.toLowerCase().trim() === quiz.answer.toLowerCase()){ 
					log("Su respuesta es correcta.");
					biglog("Correcta","green");
				}else{
					log("Su respuesta es incorrecta.");
					biglog("Incorrecta","red");
				}
					rl.prompt();
				});
		}catch(error){
			errorlog("error desconocido");
			rl.prompt();
		}
	}
};


exports.addCmd = rl => {
  	rl.question(colorize('Introduzca pregunta','red'),question => { //se queda esperando a la respuesta,despus de dar enter sale: introduzca respuesta
  		rl.question(colorize('Introduzca respuesta','red'),answer =>{
  			model.add(question,answer); // 'question' y 'answer' tienen guardo lo pasado por teclado
  			log(` ${colorize('Se ha añadido','magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
  			rl.prompt(); //se saca el prompt al final de todo
  		});
  	});
};


exports.deleteCmd = (rl,id) => { // muy parecido a show
  if(typeof id === "undefined"){    //en el caso de que no pasen 'id'
   	errorlog('Falta el parametro id');
   } else {
   		try{
   		model.deleteByIndex(id);  //borra la posicion 
   			
   		} catch(error){
   			errorlog(error.mensaje); //si el 'id' no es valido
   		}
   }
  rl.prompt();
};

exports.playCmd= rl => {
  var score = 0;
  var sinResponder = [];
  model.getAll().forEach((quiz,id) => {  //porque coge el contenido de DB_FILE en vez del array quizzes definido en model
  	sinResponder[id] = quiz;
  	//log(`  [${id}]:  ${sinResponder[id].question} `);
  	//log(`  [${id}]:  ${sinResponder[id].answer} `);
  })
  	const letsPlay = () =>{
  	if( sinResponder [0] === "undefined" || typeof sinResponder === "undefined" || sinResponder.length === 0){ //comprobar si esta vacio
  		log("No hay nada más que preguntar.");
  		log("Fin del juego. Aciertos: ", score);
		biglog(score,'magenta');
  		rl.prompt();
  	}else{
  		try{
  		var indice = 0;  //comprobar si es entero y hacia donde se redondea
  		indice = Math.floor(Math.random() * sinResponder.length);
      //console.log("%s",indice);
      	const quiz = sinResponder[indice];
 		log(`${colorize(quiz.question,'yellow')}`);
 		sinResponder.splice(indice,1); //borra el quiz del array sinResponder
  		rl.question(colorize('Introduzca respuesta :','magenta'),resp =>{ 
  			if(resp.toLowerCase().trim() === quiz.answer.toLowerCase()){
  				score++;
  				console.log("CORRECTO - Lleva %s aciertos. ",score);
  				letsPlay();
  			}else{
  				console.log(colorize("Respuesta incorrecta",'red'));
  				console.log("Numero de aciertos: ",score);
  				console.log("Fin del examen");
				biglog(score,'magenta');
  				rl.prompt();
  				}
  			});
  			}catch(error){
  					errorlog("error desconocido");
					rl.prompt();
  					}
  	   }	
	 }
	 letsPlay();
};

exports.listCmd = rl => {
  //${} para que se introduzca el valor
  model.getAll().forEach((quiz,id) => { //forEach para recorrer el array, parametros quiz y id; Con notacion arrow indicamos el codigo de la funcion
  	log(`  [${id}]:  ${quiz.question} `);
  });  
  rl.prompt();
};
exports.creditsCmd = rl =>{
	console.log("Autores de la practica: ");
	console.log("DANIEL");
	console.log("DAVID");
	rl.prompt();
};
