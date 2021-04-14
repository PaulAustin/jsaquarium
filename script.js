

let cmOptions = {
    theme: "material",
    lineNumbers: true,
    mode: "javascript",
    tabSize: 4,
}

let sampleCode = `
2 * 3
`

class JsExec {
    run () {
        console.log('run')
        this.jsi = new Interpreter(sampleCode);
        this.jsi.run()

        console.log("and the answer is ", this.jsi.value)
    }
    stop () {
        console.log('stop')
    }
    step () {
        console.log('step')
    }
}

const jse = new JsExec()

function conectUI() {
    var p = document.getElementById("runButton");
    p.onclick = jse.run;       
    var p = document.getElementById("stopButton");
    p.onclick = jse.stop;       
    var p = document.getElementById("stepButton");
    p.onclick = jse.step;       
}

function spinUp() {
    var textArea = document.getElementById("editor");
    console.log("script has been loaded", textArea)
    jse.code = new CodeMirror.fromTextArea(textArea, cmOptions);
    
    jse.code.setValue(sampleCode)
}


spinUp()
conectUI()




