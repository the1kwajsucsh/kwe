const SphereVideoShader = {
  vertexShader: `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    float hash1(float p) {
    	vec2 p2 = fract(p * vec2(5.3983, 5.4427));
        p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
    	return fract(p2.x * p2.y * 95.4337);
    }

    float hash1(vec3 p3) {
      p3 = fract(p3 * vec3(5.3983, 5.4427, 6.9371));
      p3 += dot(p3, p3.yxz + 19.1934);
      return fract(p3.x * p3.y * p3.z);
    }
    
    vec4 noised( in vec3 x) {
      vec3 p = floor(x);
      vec3 w = fract(x);
      
      vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
      vec3 du = 30.0*w*w*(w*(w-2.0)+1.0);
      
      float n = p.x + 317.0*p.y + 157.0*p.z;
      
      float a = hash1(n+0.0);
      float b = hash1(n+1.0);
      float c = hash1(n+317.0);
      float d = hash1(n+318.0);
      float e = hash1(n+157.0);
      float f = hash1(n+158.0);
      float g = hash1(n+474.0);
      float h = hash1(n+475.0);
      
      float k0 = a;
      float k1 = b-a;
      float k2 = c-a;
      float k3 = e-a;
      float k4 = a-b-c+d;
      float k5 = a-c-e+g;
      float k6 = a-b-e+f;
      float k7 = -a+b+c-d+e-f-g+h;
      
      return vec4(-1.0+2.0+(k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z),
                  2.0*du*vec3(k1 + k4*u.y + k6*u.z + k7*u.y*u.z,
                              k2 + k5*u.z + k4*u.x + k7*u.z*u.x,
                              k3 + k6*u.x + k5*u.y + k7*u.x*u.y)); 
    }

    void main() {
      vUv = uv;
      vNormal = normal;
      float noise = noised(4.*position).x;
      vec3 newPosition = position + noise*normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
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
