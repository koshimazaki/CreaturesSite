import { useEffect, useState } from 'react'
import { FireSpell } from '../shaders/FireSpell'
import { useActionStore } from '../stores/actionStore'
import { ActionTypes } from './types'

export function ShaderManager() {
    const { currentAction } = useActionStore()
    const [activeShaders, setActiveShaders] = useState({
        Fireball: false,
        Forcefield: false
    })

    useEffect(() => {
        setActiveShaders(prev => ({
            Fireball: currentAction?.id === ActionTypes.CAST_SPELLS.id,
            Forcefield: currentAction?.id === ActionTypes.PHYSICS.id
        }))
    }, [currentAction])

    return (
        <group position={[0, 0, 0]}>
            {activeShaders.Fireball && (
                <FireSpell preset="FIREBALL" />
            )}
            {activeShaders.Forcefield && (
                <FireSpell 
                    preset="FORCEFIELD"
                    customSettings={{
                        position: [0, 1, 0],
                        scale: 2.5
                    }}
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