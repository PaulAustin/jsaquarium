
import Split from './modules/splitjs/split.js'

Split(["#picture","#stdout"], {
    gutterSize: 8,
    cursor: 'row-resize',
    direction: 'vertical'}
)

// Set up spliter bars
Split(["#code","#drawing"], {
    gutterSize: 8,
    cursor: 'col-resize'}
)
