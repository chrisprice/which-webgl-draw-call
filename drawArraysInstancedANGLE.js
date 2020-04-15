export default () => {
    const vertices = [
        [-0.52, 0.70], [-0.52, 0.30], [-0.70, 0.40],
        [-0.48, 0.70], [-0.30, 0.62], [-0.48, 0.62],
        [-0.48, 0.58], [-0.20, 0.58], [-0.48, 0.30],
    ];

    const positionAttribute = fc.webglAttribute()
        .divisor(0)
        .size(2)
        .data(vertices);

    const colorAttribute = fc.webglAttribute()
        .divisor(0)
        .size(3)
        .normalized(true)
        .type(fc.webglTypes.UNSIGNED_BYTE)
        .data(vertices)
        .value((d, i) => {
            switch (i % 3) {
                case 0: return [255, 0, 0];
                case 1: return [0, 255, 0];
                case 2: return [0, 0, 255];
            }
        });

    const jiggleUniform = fc.webglUniform([0, 0]);

    const scaleUniform = fc.webglUniform([0.2, 0.2]);

    const translations = [];
    {
        const radius = 0.25;
        const count = 50;
        for (let i = 0; i <= count; i++) {
            translations.push([
                -0.4 + radius * Math.sin(i / count * Math.PI * 2),
                -0.5 + radius * Math.cos(i / count * Math.PI * 2),
            ]);
        }
    }

    const translateAttribute = fc.webglAttribute()
        .divisor(1)
        .size(2)
        .data(translations);

    const program = fc.webglProgramBuilder()
        .subInstanceCount(vertices.length);

    program
        .buffers()
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

        jiggleUniform.data([Math.sin(t * 0.3) * 0.01, Math.cos(0.2 * t) * 0.01]);

        program(translations.length);
    };

    fc.rebind(draw, program, 'context');

    return draw;
};
