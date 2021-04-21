

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
yo(pi)
x
`


class JsExec {
    run () {          
        console.log('run')
        let code = jse.code.getValue()
        console.log('code is', code)
        try {
            this.jsi = new Interpreter(code, jsiInit);
            this.jsi.run()
        } catch(err) {
            jse.stdout("Error> ")
            jse.stdout(err.message)
        }

        console.log("and the answer is ", this.jsi.value)
    }
    stop () {
        console.log('stop')
    }
    step () {
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

function yo(message) {
    jse.stdout(message)
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




