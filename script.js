

let cmOptions = {
    theme: "material",
    lineNumbers: true,
    mode: "javascript",
    tabSize: 4,
}

let sampleCode = `
let x = 2 * 3
const y = pi
for (let i = 0; i < 80; i+= 0.1) {
  
  x = 200 + Math.sin(i) * 100
  y = 100 + Math.cos(i) * 100
  
  turtle.box(x, y, 5, 5)
}
yo('and the answer is', Math.sin(pi))
x`

/*
`
let x = 2 * 3
const y = pi
for (let i = 0; i < 10; i++) {
  turtle.box(i * 10, i * 20, 40, 15)
}
yo('and the answer is', pi)
x
`
*/


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
        let code = jse.editor.getValue()
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
    stdout (...args) {

        var stringMessage = args.reduce(function (acc, cur) {
            return String(acc) + ' ' + String(cur)
        })
    
        console.log(stringMessage)
        jse.soText.value = jse.soText.value + '\n' + stringMessage;
    }

    canvasResize () {
        console.log("resize canvas to match div")
        var drawDiv = document.getElementById("drawdiv")
        jse.canvas.width  = drawDiv.innerWidth;
        jse.canvas.height = drawDiv.innerHeight;
    }

    conectUI() {
        // Set up buttons, OK this shoudle be data driven
        document.getElementById("runButton").onclick = jse.run       
        document.getElementById("stopButton").onclick = jse.stop    
        document.getElementById("stepButton").onclick = jse.step
        document.getElementById("clearButton").onclick = jse.clear
        document.getElementById("drawdiv").addEventListener("resize", jse.canvasResize, false);
        
        jse.canvas = document.getElementById("canvas");
        var ctx = jse.canvas.getContext("2d") 
        jse.stdDraw = new StdCanvas(ctx)   

        jse.stdDraw.circle(50, 50, 40, 40)
        jse.stdDraw.box(100, 100, 10, 10)
    }
}

// Make this a method on JSE ???
function takeStep() {
    var moreToDo = false

    try {
        //console.log('taking a step')
        for (let i = 0; i < 200; i++) {
            moreToDo = jse.jsi.step()
            if (!moreToDo)
                break;
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

function addDrawMethods() {
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
    jse.stdout(...args)
}

function jsiInit(jsi, gns) {
    jsi.setProperty(gns, 'pi', 3.14159);
    jsi.setProperty(gns, 'yo', jsi.createNativeFunction(yo));

    jsi.setProperty(gns, 't1', jsi.createNativeFunction(test1));

    // Make a empty object add it to the global name space
    var turtle = jsi.nativeToPseudo({});
    jsi.setProperty(gns, 'turtle', turtle);

    // Define 'turtle.box' method.
    jsi.setProperty(turtle, 'box',
        jsi.createNativeFunction((x,y,w,h) => (jse.stdDraw.box(x,y,w,h) ))
        );

    jsi.setProperty(turtle, 'circle',
        jsi.createNativeFunction((x,y,d) => (jse.stdDraw.circle(x,y,d) ))
        );

    jsi.setProperty(turtle, 't1',
        jsi.createNativeFunction(test1)
        );

}

function test1(x, y, w, h) {
    jse.stdDraw.box(x, y, w, h)
}

function spinUp() {
    var textArea = document.getElementById("editor");
    console.log("script has been loaded", textArea)
    jse.editor = new CodeMirror.fromTextArea(textArea, cmOptions);
    
    jse.editor.setValue(sampleCode)
    jse.soText = document.getElementById("console");
    jse.conectUI()

}

spinUp()

