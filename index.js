import drawArraysSeries from './drawArrays.js';
import drawElementsSeries from './drawElements.js';
import drawArraysInstancedSeries from './drawArraysInstancedANGLE.js';
import drawElementsInstancedSeries from './drawElementsInstancedANGLE.js';

const series = [
    drawArraysSeries(),
    drawElementsSeries(),
    drawArraysInstancedSeries(),
    drawElementsInstancedSeries()
];

let t = 0;
const d3fcCanvas = document.querySelector('d3fc-canvas');
d3fcCanvas.addEventListener('draw', () => {
    const ctx = d3fcCanvas.querySelector('canvas').getContext('webgl');
    series.forEach(series => {
        series.context(ctx)(t);
    })
    t += 1;
});
d3fcCanvas.requestRedraw();

setInterval(() => d3fcCanvas.requestRedraw(), 10);

document.querySelector('#loading').style.display = 'none';
