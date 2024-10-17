CameraMove.jsx

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';

const DEG45 = Math.PI / 4;

export default function App() {
	const cameraControlRef = useRef<CameraControls | null>(null);

	return (
		<>
			<Canvas>
				<CameraControls ref={cameraControlRef} />
				<mesh>
					<boxGeometry />
					<meshBasicMaterial color={0xff0000} wireframe />
				</mesh>
			</Canvas>
			<div style={{ position: 'absolute', top: '0' }}>
				<button
					type="button"
					onClick={() => {
						cameraControlRef.current?.rotate(DEG45, 0, true);
					}}
				>
					rotate theta 45deg
				</button>
				<button
					type="button"
					onClick={() => {
						cameraControlRef.current?.reset(true);
					}}
				>
					reset
				</button>
			</div>
		</>
	);
}
