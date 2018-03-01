
const readline = require('readline');
const model = require('./model'); //importa el fichero model(local)
const {log,biglog,errorlog,colorize} = require ("./out");
const cmds = require("./cmds");
biglog('CORE Quiz','blue');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: colorize("quiz > ", 'blue'),

  completer:(line) => {
  const completions = 'delete help list edit add test credits play quit'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // show all completions if none found
  return [hits.length ? hits : completions, line];
}

});

rl.prompt();

rl.on('line', (line) => {

  let args=line.split(" ");
  let cmd =args[0].toLowerCase().trim();

  switch (cmd) {
    case '':
  rl.prompt();
  break;

    case 'h':
    case 'help':
       cmds.helpCmd(rl); // se pone cmds delante para que lo encuentre en el otro fichero
      break;             //ademas se introduce rl para sacar el prompt

    case 'quit':
    case 'q':
  rl.close(rl);
  break;

     case 'add':
  cmds.addCmd(rl); 
  break;

     case 'list':
  cmds.listCmd(rl);
  break;

     case 'show':
  cmds.showCmd(rl,args[1]);
  break;

     case 'test':
  cmds.testCmd(rl,args[1]);
  break;

     case 'p':
     case 'play':
  cmds.playCmd(rl);
  break;

     case 'delete':
  cmds.deleteCmd(rl,args[1]);
  break;

     case 'edit':
  cmds.editCmd(rl,args[1]);
  break;

      case 'credits':
  cmds.creditsCmd(rl);
  break;
    default:
      console.log(`Comando desconocido '${colorize(cmd,'red')}'`);
      console.log("Utilice help para ver todos los comandos");
      rl.prompt();
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Sacabo');
  process.exit(0);
});

