import { useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import {Color, MathUtils} from "three"
import React from "react"
import {Box} from "@react-three/drei";

const orangeColor = new Color("orange");
const pinkColor = new Color("hotpink");

export default function InteractiveBox({position}) {
    const ref = useRef();

    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    useFrame(() => {
      if(ref.current != null){
        ref.current.rotation.x = ref.current.rotation.y += 0.01;
        ref.current.material.color = hovered ? pinkColor : orangeColor;
        ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, active ? 1.5 : 1, 0.1);
        ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, active ? 1.5 : 1, 0.1);
        ref.current.scale.z = MathUtils.lerp(ref.current.scale.z, active ? 1.5 : 1, 0.1);
      }
    });
  
    return (
      <Box ref={ref}
           position={position}
           onClick={() => setActive(!active)}
           onPointerOver={() => setHover(true)}
           onPointerOut={() => setHover(false)}
       />
    )
  }