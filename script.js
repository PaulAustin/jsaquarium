

let cmOptions = {
    theme: "material",
    lineNumbers: true,
    mode: "javascript",
    tabSize: 4,
}

let sampleCode = `
let x = 2 * 3
const y = pi
for (let i = 0; i < 10; i++) {
  x += i
}
yo('and the answer is', pi)
x
`


class JsExec {
    run () {          
        console.log('run')
        let code = jse.code.getValue()
        console.log('code is', code)
        try {
            jse.jsi = new Interpreter(code, jsiInit);
           // jse.jsi.appendCode()
        } catch(err) {
            jse.stdout("Error> ")
            jse.stdout(err.message)
        }
        takeStep()
    }
    stop () {
        console.log('stop')
    }
    step () {
        // if not runing yet, then start up JSI
        console.log('step')
    }
    clear () {
        console.log('step')
        jse.soText.value = "";
    }
    stdout (message) {
        console.log(message)
        jse.soText.value = jse.soText.value + '\n' + message;
    }
}

// Make this a method on JSE ???
function takeStep() {
    var moreToDo = false

    try {
        //console.log('taking a step')
        for (let i = 0; i < 20; i++) {
            moreToDo = jse.jsi.step()
        }
        // Need to see what node in the AST the code is at
    } catch(err) {
        jse.stdout("Error> ")
        jse.stdout(err.message)
    }

    if (moreToDo) {
        window.setTimeout(takeStep, 0);
    } else {
        console.log('>all done now')
        console.log('>and the answer is ', jse.jsi.value)
    }
}

const jse = new JsExec()

function conectUI() {

    // Set up buttons
    var p = document.getElementById("runButton");
    p.onclick = jse.run;       
    var p = document.getElementById("stopButton");
    p.onclick = jse.stop;       
    var p = document.getElementById("stepButton");
    p.onclick = jse.step;       
    var p = document.getElementById("clearButton");
    p.onclick = jse.clear;       
}

function addBotMethods() {
    var myCode = 'robot.forwards(robot.fast);';
    var initFunc = function(interpreter, globalObject) {
      // Create 'robot' global object.
      var robot = interpreter.nativeToPseudo({});
      interpreter.setProperty(globalObject, 'robot', robot);

      // Define 'robot.fast' property.
      interpreter.setProperty(robot, 'fast', 99);

      // Define 'robot.forwards' function.
      var wrapper = function forwards(speed) {
        return realRobot.forwards(speed);
      };
      interpreter.setProperty(robot, 'forwards',
          interpreter.createNativeFunction(wrapper));
    };
    var myInterpreter = new Interpreter(myCode, initFunc);
}

function yo(...args) {
    var stringMessage = args.reduce(function (acc, cur) {
        return String(acc) + ' ' + String(cur)
    })
    jse.stdout(stringMessage)
}

function jsiInit(jsi, glob) {
    jsi.setProperty(glob, 'pi', 3.14159);
    jsi.setProperty(glob, 'yo', jsi.createNativeFunction(yo));
}

function spinUp() {

    var textArea = document.getElementById("editor");
    console.log("script has been loaded", textArea)
    jse.code = new CodeMirror.fromTextArea(textArea, cmOptions);
    
    jse.code.setValue(sampleCode)
    jse.soText  = document.getElementById("console");
}


spinUp()
conectUI()




