export const SymbolShader = {
  uniforms: {
    textureAtlas: { type: "t", value: undefined },
    initialOpacity: {value: 1.0},
  },
  vertexShader: `
    attribute vec2 textureOffsets;
    varying vec2 vTextureOffsets;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;   
      vTextureOffsets = textureOffsets;
   
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec2 vTextureOffsets;
    uniform sampler2D textureAtlas;
    uniform float initialOpacity;
    
    // linear mapping of x from range [a1, a2] to range [b1, b2]
    float mapLinear(float x, float a1, float a2, float b1, float b2) {
      return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
    }
    
    void main() {
      vec2 uv = vUv;
      vec2 texCoordinate;
      
      texCoordinate.x = mapLinear(uv.x, 0.0, 1.0, vTextureOffsets.x, vTextureOffsets.x + 0.2);
      texCoordinate.y = mapLinear(uv.y, 0.0, 1.0, vTextureOffsets.y, vTextureOffsets.y + 0.2);
      
      vec4 tex = vec4(texture2D(textureAtlas, texCoordinate));
      gl_FragColor = vec4(tex.xyz, initialOpacity);
}
  `
};