// import React from 'react';
// import { motion } from 'framer-motion';
// import bannerImage from '/src/assets/images/Logobaner.png';

// const BannerButton = ({ onClick }) => {
//   return (
//     <motion.button
//       onClick={onClick}
//       whileTap={{ scale: 0.95 }}
//       style={{
//         background: 'none',
//         border: 'none',
//         cursor: 'pointer',
//         padding: 0,
//         margin: 0,
//         position: 'relative',
//         width: '100%',
//         maxWidth: '400px',
//         aspectRatio: '5 / 1',
//         overflow: 'hidden',
//       }}
//     >
//       <div
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundImage: `url(${bannerImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
//           WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
//         }}
//       />
//       <div
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: `
//             radial-gradient(circle, transparent 30%, #000 70%),
//             linear-gradient(to right, transparent, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.8) 80%, transparent),
//             repeating-conic-gradient(#000 0%, #000 25%, transparent 0%, transparent 50%)
//               50% / 10px 10px
//           `,
//           mixBlendMode: 'multiply',
//           opacity: 0.5,
//         }}
//       />
//     </motion.button>
//   );
// };

// export default BannerButton;
