import { useEffect, useState } from 'react'
import { FireSpell } from '../shaders/FireSpell'
import { PhysicsField } from '../shaders/PhysicsField'
import { useActionStore } from '../stores/actionStore'
import { ActionTypes } from '../SceneMods/types'

export function ShaderManager() {
    const { currentAction } = useActionStore()
    const [activeShaders, setActiveShaders] = useState({
        FireSpell: false,
        PhysicsField: false
    })

    useEffect(() => {
        setActiveShaders(prev => ({
            FireSpell: currentAction?.id === ActionTypes.CAST_SPELLS.id,
            PhysicsField: currentAction?.id === ActionTypes.PHYSICS.id
        }))
    }, [currentAction])

    return (
        <group position={[0, 0, 0]}>
            {activeShaders.FireSpell && <FireSpell />}
            {activeShaders.PhysicsField && (
                <PhysicsField 
                    visible={true}
                    position={[0, 1, 0]}
                    scale={[1, 1, 1]}
                />
            )}
        </group>
    )
}

export const toggleShader = (shaderName, value) => {
    setActiveShaders(prev => ({
        ...prev,
        [shaderName]: value
    }))
} 