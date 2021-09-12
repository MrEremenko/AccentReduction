import {  useState } from 'react';
import Register from '../Onboarding/Register/Register';
// import Logo from '../../Logo';

const FrontPage = () => {

  const [showRegister, setShowRegister] = useState(false);

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh", display: "flex", alignItems: "center", flexDirection: "column"}}>
        <button onClick={e => setShowRegister(true)}>Sign Up</button>
        <div style={{ alignItems: "center", fontSize: "30px", color: "black" }}>
          <span>Please say the following sentence</span>
        </div>
        <div>
          <span>Download the extension here and view facts as you watch videos!</span>
        </div>
        <div>
          <span>Download the mobile app to have the facts at your fingertips if you ever need to provide evidence!</span>
        </div>
        <Register showRegister={showRegister} setShowRegister={setShowRegister} />
    </div>
  );
}

export default FrontPage;