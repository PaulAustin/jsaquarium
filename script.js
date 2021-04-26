

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

// A simple turtle like canvas
class StdCanvas {
    constructor (ctx) {
        this.ctx = ctx
    }
    // Style would be a bit like a CSS set of prooperties
    stytle (style) {
        this.style = style
    }
    box (x, y, w, h) {
        console.log('darw box',x,y,w,h)
        let ctx = this.ctx
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fillStyle = "Cyan";
        ctx.fill();
        ctx.closePath();
    }
    circle (x, y, d) {
        let ctx = this.ctx
        ctx.beginPath();
        ctx.arc(x, y, d / 2.0, 0, Math.PI*2);
        ctx.fillStyle = "Pink";
        ctx.fill();
        ctx.closePath();
    }
    f (d) {

    }
    b (d) {

    }
    text () {

    }
}

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
    conectUI() {
        // Set up buttons, OK this shoudle be data driven
        document.getElementById("runButton").onclick = jse.run       
        document.getElementById("stopButton").onclick = jse.stop    
        document.getElementById("stepButton").onclick = jse.step
        document.getElementById("clearButton").onclick = jse.clear
        
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d") 
        jse.stdDraw = new StdCanvas(ctx)   

        jse.stdDraw.box(100, 100, 10, 10)
        jse.stdDraw.circle(110, 110, 10, 10)
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
    jse.conectUI()

}

spinUp()

