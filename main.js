
import Split from './modules/splitjs/split.js'

Split(["#drawdiv","#stdoutdiv"], {
    gutterSize: 8,
    cursor: 'row-resize',
    direction: 'vertical'}
)

// Set up spliter bars
Split(["#codediv","#outdiv"], {
    gutterSize: 8,
    cursor: 'col-resize'}
)
