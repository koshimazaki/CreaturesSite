// import { useEffect } from 'react';
// import { useThree } from '@react-three/fiber';
// import { useActionStore } from '../stores/actionStore'; // New store
// import { useStore } from '../stores/zustandStore';


// const DynamicSceneControl = () => {
//     const { activeAction, toggleVisibility } = useActionStore(state => ({
//         activeAction: state.activeAction,
//         toggleVisibility: state.toggleVisibility,
//     }));
    
//     const { scene } = useThree();

//     useEffect(() => {
//         scene.children.forEach(child => {
//             if (child.userData.model) {
//                 child.visible = false;
//             }
//         });

//         if (activeAction === 'ExploreWorlds') {
//             toggleVisibility('pyramid', true);
//         } else if (activeAction === 'CastSpells') {
//             toggleVisibility('fire', true);
//         } else if (activeAction === 'FightBosses') {
//             toggleVisibility('boss', true);
//         } else if (activeAction === 'BendPhysics') {
//             toggleVisibility('mainCharacter', true);
//         }
//     }, [activeAction, toggleVisibility, scene]);

//     return null;
// };

// export default DynamicSceneControl;
