import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { Logo } from '@pmndrs/branding'
// import { Svg } from '@react-three/drei'
import logoUrl from './logo.svg'

function Overlay() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      {/* <a href="https://glitchnftstudio.xyz/" style={{ position: 'absolute', bottom: 40, left: 120, fontSize: '13px', opacity: '0.85'}}>
        Glitch NFT
        <br />
        Studio
      </a> */}
      <div style={{ position: 'absolute', top: 40, left: 40, fontSize: '13px' }}></div>
      {/* <div style={{ position: 'absolute', top: 40, right: 40, fontSize: '13px',opacity: '0.85' }}>GlitchCandies:         <br />
      Creatures</div>
      <img src={logoUrl} alt="Logo" style={{ position: 'absolute', bottom: 40, left: 40, width: 30 }} /> */}

    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Overlay />
    {/* <Svg
        src={logoUrl}
        scale={[0.1, 0.1, 0.1]}
        position={[0, 0, 0]}
      /> */}
  </>
)

