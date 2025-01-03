# GlitchCandies: Creatures Landing Page

[Live site](https://supernaturalcreatures.xyz/)

This is the landing page for the **GlitchCandies: Creatures** web experience, built using [**R3F**](https://r3f.docs.pmnd.rs/getting-started/introduction), [**Three.js**](https://threejs.org/examples/), and **Vite**. 
It leverages [PMDRS Drei](https://github.com/pmndrs/drei) examples and helpers, alongside a [**Space.js Hologram-inspired shader**](https://alien.js.org/examples/three/shader_hologram.html). 
UI is styled with **MUI**, Framer motion and enhanced with a few CSS tricks and custom GLSL shaders.

The 3D models are generated using a custom generative AI workflow with **Flux** and SDXL **LoRAs** (see [**Civitai profile**](https://civitai.com/user/koshimazaki) for download) alongside **Tripo3D** for image-to-3D generations. 
Models are optimised with [gltfjsx](https://github.com/pmndrs/gltfjsx) and draco. Images with magick and pngquant.

https://github.com/user-attachments/assets/8fbc6703-227b-4b47-bb0c-d86ee8d841fd

There are a few hidden easter eggs—use the `1` and `2` keys to cycle between audio tracks `3` pauses, `/` activates fullscreen mode. Check also logo for fun stuff...

Added [**RiveUI**](https://github.com/rive-app/rive-react) integration using buttons and Loading screen and dynamic scene changes. 
Here is super cool [tamplete from Michal Ocilka](https://rive.app/community/files/12307-23404-astralion-ui/) used to integrate with Rive. 

I see this as a living project and will continue adding new features as I explore the **WebGL** and **Three.js** ecosystem.

