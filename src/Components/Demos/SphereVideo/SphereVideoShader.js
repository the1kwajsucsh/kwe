const SphereVideoShader = {
  vertexShader: `
    varying vec2 vUv; 

    void main() {
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D map;
      
      void main()	{
          vec2 uv = vUv;
          vec4 color = texture2D(map, uv);
          gl_FragColor = color;
      }
  `,
  uniforms: {
    map: {
      type: "t",
      value: ""
    },
    time: {type: "f", value: 0}
  }
};

export { SphereVideoShader };
