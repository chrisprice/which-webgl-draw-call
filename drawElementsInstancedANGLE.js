export default () => {
    const vertices = [
        [0.5, 0.5]
    ];
    const colours = [
        [255, 255, 255]
    ];
    const elementIndices = [];

    {
        const radius = 0.2;
        const count = 50;
    
        for (let i = 0; i <= count; i++) {
            vertices.push([
                vertices[0][0] + radius * Math.sin(i / count * Math.PI * 2),
                vertices[0][1] + radius * Math.cos(i / count * Math.PI * 2),
            ]);
            colours.push([
                128 + 128 * Math.sin(i / count * Math.PI * 2),
                128 + 128 * Math.sin((i / count + 1 / 3) * Math.PI * 2),
                128 + 128 * Math.sin((i / count + 2 / 3) * Math.PI * 2)
            ]);
        }
        
        for (let i = 0; i < count; i++) {
            elementIndices.push(0, i + 1, i + 2);
        }
    }

    const positionAttribute = fc.webglAttribute()
        .divisor(0)
        .size(2)
        .data(vertices);

    const colorAttribute = fc.webglAttribute()
        .divisor(0)
        .size(3)
        .normalized(true)
        .type(fc.webglTypes.UNSIGNED_BYTE)
        .data(colours);

    const jiggleUniform = fc.webglUniform([0, 0]);

    const scaleUniform = fc.webglUniform([0.2, 0.2]);

    const translations = [];
    {
        const radius = 0.25;
        const count = 1000;
        for (let i = 0; i <= count; i++) {
            translations.push([
                0.4 + radius * Math.sin(i / count * Math.PI * 2),
                -0.5 + radius * Math.cos(i / count * Math.PI * 6),
            ]);
        }
    }

    const translateAttribute = fc.webglAttribute()
        .divisor(1)
        .size(2)
        .data(translations);

    const program = fc.webglProgramBuilder()
        .subInstanceCount(elementIndices.length);

    program
        .buffers()
        .elementIndices(fc.webglElementIndices(elementIndices))
        .attribute('aPosition', positionAttribute)
        .attribute('aColor', colorAttribute)
        .attribute('aTranslate', translateAttribute)
        .uniform('uJiggle', jiggleUniform)
        .uniform('uScale', scaleUniform);

    const draw = t => {
        program
            .vertexShader(() => `
            precision mediump float;

            uniform vec2 uJiggle;
            uniform vec2 uScale;
            attribute vec2 aPosition;
            attribute vec3 aColor;
            attribute vec2 aTranslate;
            varying vec4 vColor;

            void main() {
                gl_Position = vec4(aTranslate + (aPosition * uScale) + uJiggle, 0.0, 1.0);
                vColor = vec4(aColor, 1.0);
            }`)
            .fragmentShader(() => `
            precision mediump float;

            varying vec4 vColor;
            void main() {
                gl_FragColor = vColor;
            }`);

        jiggleUniform.data([Math.sin(t * 0.3) * 0.01, Math.cos(0.1 * t) * 0.01]);

        program(translations.length);
    };

    fc.rebind(draw, program, 'context');

    return draw;
};
