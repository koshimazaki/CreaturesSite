import { useEffect, useState } from 'react'
import { FireShader } from '../shaders/FireShader'
import { PhysicsField } from '../shaders/PhysicsField'
import { useActionStore } from '../stores/actionStore'

export function ShaderManager() {
    const { currentAction } = useActionStore()
    const [activeShaders, setActiveShaders] = useState({
        FireShader: false,
        PhysicsField: false
    })

    useEffect(() => {
        console.log('Current action:', currentAction); // Debug current action
        setActiveShaders(prev => ({
            FireShader: currentAction?.id === 'CAST_SPELLS',
            PhysicsField: currentAction?.id === 'PHYSICS'
        }))
    }, [currentAction])

    console.log('Active shaders:', activeShaders); // Debug active shaders

    return (
        <group position={[0, 0, 0]}>
            {activeShaders.FireShader && (
                <FireShader 
                    visible={true}
                    position={[0, 1, 0]} // Adjust position to match your model
                    scale={[1, 1, 1]}   // Adjust scale as needed
                />
            )}
            {activeShaders.PhysicsField && (
                <PhysicsField 
                    visible={true}
                    position={[0, 1, 0]} // Adjust position to match your model
                    scale={[1, 1, 1]}   // Adjust scale as needed
                />
            )}
        </group>
    )
} 