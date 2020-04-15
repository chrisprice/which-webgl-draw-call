export default () => {
    const vertices = [
        [-0.52, 0.70], [-0.52, 0.30], [-0.70, 0.40],
        [-0.48, 0.70], [-0.30, 0.62], [-0.48, 0.62],
        [-0.48, 0.58], [-0.20, 0.58], [-0.48, 0.30],
    ];

    const positionAttribute = fc.webglAttribute()
        .size(2)
        .data(vertices);

    const colorAttribute = fc.webglAttribute()
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

    const jiggleUniform = fc.webglUniform(0);

    const program = fc.webglProgramBuilder();

    program
        .buffers()
        .attribute('aPosition', positionAttribute)
        .attribute('aColor', colorAttribute)
        .uniform('uJiggle', jiggleUniform);

    const draw = t => {
        program
            .vertexShader(() => `
            precision mediump float;

            uniform vec2 uJiggle;
            attribute vec3 aColor;
            attribute vec2 aPosition;
            varying vec4 vColor;

            void main() {
                gl_Position = vec4(aPosition + uJiggle, 0.0, 1.0);
                vColor = vec4(aColor, 1.0);
            }`)
            .fragmentShader(() => `
            precision mediump float;

            varying vec4 vColor;
            void main() {
                gl_FragColor = vColor;
            }`);

        jiggleUniform.data([Math.sin(t * 0.3) * 0.01, Math.cos(0.1 * t) * 0.01]);

        program(vertices.length);
    };

    fc.rebind(draw, program, 'context');

    return draw;
};
