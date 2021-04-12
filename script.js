
let cmOptions = {
    theme: "material",
    lineNumbers: true,
    mode: "javascript",
    tabSize: 4,
}

var textArea = document.getElementById("editor");
console.log("script has been loaded", textArea)
var code = new CodeMirror.fromTextArea(textArea, cmOptions);

code.setValue("console.log('yo');")

