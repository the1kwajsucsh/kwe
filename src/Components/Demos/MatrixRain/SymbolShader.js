export const SymbolShader = {
  uniforms: {
    textureAtlas: { type: "t", value: undefined },
    u_time: {type: "f", value: 0.0},
    opacity: {type: "f", value: 1.0},
    scale: {type: "f", value: 1.0},
  },
  vertexShader: `
    uniform float scale;
    attribute vec2 textureOffsets;
    attribute float opacity;
    varying vec2 vTextureOffsets;
    varying float vOpacity;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;   
      vTextureOffsets = textureOffsets;
      vOpacity = opacity;
   
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_PointSize = 1.0 * ( 300.0 / -mvPosition.z )*scale;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec2 vTextureOffsets;
    varying float vOpacity;
    uniform sampler2D textureAtlas;
    uniform float u_time;
    
    float randFromFloat(float x) {
      return fract(sin(x)*1.0);
    }
    
    float randFromVec2(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    // linear mapping of x from range [a1, a2] to range [b1, b2]
    float mapLinear(float x, float a1, float a2, float b1, float b2) {
      return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
    }
    
    void main() {
      vec2 uv = vUv;
      vec2 texCoordinate;
      float opacity = vOpacity;
      
      texCoordinate.x = mapLinear(gl_PointCoord.x, 0.0, 1.0, vTextureOffsets.x, vTextureOffsets.x + 0.2);
      texCoordinate.y = mapLinear(gl_PointCoord.y, 0.0, 1.0, vTextureOffsets.y, vTextureOffsets.y + 0.2);
      
      vec4 tex = texture2D(textureAtlas, texCoordinate);
      
      if (opacity > 0.99) {
        tex.r = 115.0 / 255.0;
        tex.g = 241.0 / 255.0;
        tex.b = 156.0 / 255.0;
      }
      
      // Symbol flicker
      // if (randFromFloat(u_time) < 0.3 && randFromVec2(vTextureOffsets) < 0.001) {
      //   opacity = 0.00;
      // } else {
      //   opacity = 1.0;
      // }
      
      tex.a = tex.a * opacity;
      gl_FragColor = tex;
}
  `
};