export const SymbolShader = {
  uniforms: {
    textureAtlas: { type: "t", value: undefined },
    u_time: {type: "f", value: 0.0},
    opacity: {type: "f", value: 1.0},
  },
  vertexShader: `
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
      gl_PointSize = 1.0 * ( 300.0 / -mvPosition.z );
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec2 vTextureOffsets;
    varying float vOpacity;
    uniform sampler2D textureAtlas;
    uniform float u_time;
    
    // linear mapping of x from range [a1, a2] to range [b1, b2]
    float mapLinear(float x, float a1, float a2, float b1, float b2) {
      return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
    }
    
    void main() {
      vec2 uv = vUv;
      vec2 texCoordinate;
      
      texCoordinate.x = mapLinear(gl_PointCoord.x, 0.0, 1.0, vTextureOffsets.x, vTextureOffsets.x + 0.2);
      texCoordinate.y = mapLinear(gl_PointCoord.y, 0.0, 1.0, vTextureOffsets.y, vTextureOffsets.y + 0.2);
      
      vec4 tex = texture2D(textureAtlas, texCoordinate);
      
      if (vOpacity > 0.95) {
        tex.r = 115.0 / 255.0;
        tex.g = 241.0 / 255.0;
        tex.b = 156.0 / 255.0;
      }
      
      tex.a = tex.a * vOpacity;
      
      gl_FragColor = tex;
}
  `
};