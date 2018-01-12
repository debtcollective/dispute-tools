// import * as utils from './utils';

export default class Glitch {
  static get _defaults() {
    return {
      delay: 2000,
      times: 30,
      now: 0,
      delta: 0,
      then: 0,
    };
  }

  static get vertexShader() {
    return `
      attribute vec2 position;
      attribute vec2 vertTexCoord;

      varying vec2 fragTexCoord;

      void main() {
        fragTexCoord = vertTexCoord;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
  }

  static get fragmentShader() {
    return `
      #ifdef GL_ES
      precision highp float;
      #endif

      uniform sampler2D sampler;
      uniform float amount;
      uniform float angle;

      varying vec2 fragTexCoord;

      void main() {
        vec2 offset = amount * vec2(cos(angle), sin(angle));
        vec4 cr = texture2D(sampler, fragTexCoord + offset);
        vec4 cga = texture2D(sampler, fragTexCoord);
        vec4 cb = texture2D(sampler, fragTexCoord - offset);
        gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
      }
    `;
  }

  static get vertices() {
    return new Float32Array([
      // X, Y U, V
      -1,
      -1,
      0,
      0,
      1,
      -1,
      1,
      0,
      -1,
      1,
      0,
      1,

      -1,
      1,
      0,
      1,
      1,
      -1,
      1,
      0,
      1,
      1,
      1,
      1,
    ]);
  }

  static run(ts) {
    Glitch._raf = requestAnimationFrame(Glitch._draw);

    const now = ts || performance.now();
    for (let i = 0, len = Glitch.instances.length; i < len; i++) {
      Glitch.instances[i].draw(now);
    }
  }

  static stop() {
    cancelAnimationFrame(Glitch._raf);

    for (let i = 0, len = Glitch.instances.length; i < len; i++) {
      Glitch.instances[i]._paint();
    }
  }

  constructor(config = {}) {
    Object.assign(this, Glitch._defaults, config);

    this.canvas = this._createCanvas();
    this.gl =
      this.canvas.getContext('webgl') ||
      this.canvas.getContext('experimental-webgl');

    this._elapsed = 0;

    Glitch.instances.push(this);

    this._bindEvents()._init();
  }

  load(image, callback) {
    function c() {
      image.onload = null;
      this._image = image;
      this._handleWindowResize();
      this._createTexture(image);
      callback(null, image);
    }

    image.onload = c.call(this);

    if (image.complete) {
      c.call(this);
    }

    return this;
  }

  render(element, beforeElement) {
    this._paint();

    if (beforeElement) {
      element.insertBefore(this.canvas, beforeElement);
    } else {
      element.appendChild(this.canvas);
    }

    return this;
  }

  draw(now) {
    this.now = now;
    this.delta = this.now - this.then;

    if (this.delta > this.delay) {
      this._elapsed++;

      this._paint(Math.random() * Math.PI, Math.random() * 0.02);

      if (this._elapsed > this.times) {
        this._elapsed = 0;
        this.then = this.now - this.delta % this.delay;
        this.delay = Math.random() * 5000;
        this.times = Math.random() * 30;
        this._paint();
      }

      return this;
    }

    return this._paint();
  }

  _paint(angle = 0, amount = 0) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.activeTexture(this.gl.TEXTURE0);

    this.gl.uniform1f(this.program.angle, angle);
    this.gl.uniform1f(this.program.amount, amount);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    return this;
  }

  _createCanvas() {
    const canvas = document.createElement('canvas');

    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.right = 0;
    canvas.style.bottom = 0;
    canvas.style.left = 0;

    return canvas;
  }

  _createTexture(texture) {
    this.texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.LINEAR,
    );
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      texture,
    );
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);

    this.gl.useProgram(this.program);
  }

  _init() {
    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vertexShader, Glitch.vertexShader);
    this.gl.compileShader(vertexShader);
    // utils.checkIsValidShader(this.gl, vertexShader, 'vertexShader');

    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fragmentShader, Glitch.fragmentShader);
    this.gl.compileShader(fragmentShader);
    // utils.checkIsValidShader(this.gl, fragmentShader, 'fragmentShader');

    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);
    // utils.checkIsValidProgram(this.gl, this.program);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      Glitch.vertices,
      this.gl.STATIC_DRAW,
    );

    this.program.position = this.gl.getAttribLocation(this.program, 'position');
    this.program.vertTexCoord = this.gl.getAttribLocation(
      this.program,
      'vertTexCoord',
    );
    this.program.amount = this.gl.getUniformLocation(this.program, 'amount');
    this.program.angle = this.gl.getUniformLocation(this.program, 'angle');

    this.gl.enableVertexAttribArray(this.program.position);
    this.gl.enableVertexAttribArray(this.program.vertTexCoord);

    const BPE = Float32Array.BYTES_PER_ELEMENT;
    this.gl.vertexAttribPointer(
      this.program.position,
      2,
      this.gl.FLOAT,
      this.gl.FALSE,
      4 * BPE,
      0,
    );
    this.gl.vertexAttribPointer(
      this.program.vertTexCoord,
      2,
      this.gl.FLOAT,
      this.gl.FALSE,
      4 * BPE,
      2 * BPE,
    );
  }

  _bindEvents() {
    this._handleWindowResizeRef = this._handleWindowResize.bind(this);
    window.addEventListener('resize', this._handleWindowResizeRef);
    return this;
  }

  _handleWindowResize() {
    this.canvas.width = this._image.width;
    this.canvas.height = this._image.height;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
}

Glitch._supported = (function _supported() {
  const canvas = document.createElement('canvas');
  const gl =
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return gl && gl instanceof WebGLRenderingContext;
})();
Glitch.instances = [];
Glitch._draw = Glitch.run.bind(Glitch);
