import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, createUserError } from "../../../actions/userActions";


function useOutsideAlerter(ref, setShowRegister, setEmail, setUsername, setPassword) {
  useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
          if (ref.current && !ref.current.contains(event.target)) {
              // alert("You clicked outside of me!");
              setShowRegister(false);
              setEmail("");
              setUsername("");
              setPassword("");
          }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [ref]);
}


const Register = ({ showRegister, setShowRegister }) => {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [checkbox, setCheckbox] = useState(false);

  const [numbers, setNumbers] = useState(false);
  const [lowerLetters, setLowerLetters] = useState(false);
  const [upperLetters, setUpperLetters] = useState(false);
  const [specialChars, setSpecialChars] = useState(false);
  const [minimum8, setMinimum8] = useState(false);

  const [readyToSubmit, setReadyToSubmit] = useState()

  const dispatch = useDispatch();

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setShowRegister, setEmail, setUsername, setPassword);

  const submitCredentials = (e) => {
    e.preventDefault();
    dispatch(createUser({ username, email, password }));
    // axios.post(`/api/user/confirm`, { username: username, password: password, confirmationId: confirmationId })
    // .then(res => {
    //   console.log(res.data);
    //   if(res.data.success) { //if email was confirmed successfully, redirect to main chat; need to pass some info through though;
    //     console.log('in here...');
    //     history.push('/home');
    //   }
    // })
    // .catch((error) =>{
    //   // console.log(JSON.stringify(error.response, null, 2));
    //   setError("something went wrong...");
    // });
  }

  return (showRegister ? 
    <div id="SignUpModal" style={{ position: "fixed", zIndex: "1",  display: "flex", alignItems: "center", justifyContent: "center",
      left: "0", top: "0", width: "100%", height: "100%", overflow: "auto", backgroundColor: "rgba(0,0,0,0.4)" }}>
      <div ref={wrapperRef} id="ManagePopUpContent" style={{ display: "flex", borderStyle: "solid", backgroundColor: "white", flexDirection: "column", 
      margin: "auto", padding: "20px", width:"15%" }}>
      <form onSubmit={submitCredentials} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "90%" }}>
                <input id="newEmailField" style={{ fontSize: "18px", fontFamily: "Open Sans", height: "55px",
                  width: "99%", outline: "none", borderTopStyle: "none", borderRightStyle: "none", borderLeftStyle: "none"}} 
                  value={email} placeholder={"Email"} onChange={(e) => setEmail(e.target.value)}/>
                <input id="newUsernameField" style={{ fontSize: "18px", fontFamily: "Open Sans", height: "55px",
                  width: "99%", outline: "none", borderTopStyle: "none", borderRightStyle: "none", borderLeftStyle: "none"}} 
                  value={username} placeholder={"Username"} onChange={(e) => setUsername(e.target.value)}/>
                <input id="newPasswordField" type="password" style={{ fontSize: "18px", fontFamily: "Open Sans", height: "55px",
                  width: "99%", outline: "none", borderTopStyle: "none", borderRightStyle: "none", borderLeftStyle: "none"}} 
                  value={password} placeholder={"Password"} onChange={(e) => { 
                    setPassword(e.target.value);
                    setNumbers(/(?=.*[0-9])/.test(e.target.value));
                    setSpecialChars(/(?=.*[!@#\$%\^&\*])/.test(e.target.value));
                    setUpperLetters(/(?=.*[A-Z])/.test(e.target.value));
                    setLowerLetters(/(?=.*[a-z])/.test(e.target.value));
                    setMinimum8(/(?=.{8,})/.test(e.target.value));
                    setReadyToSubmit(/(?=.*[0-9])/.test(e.target.value) && /(?=.*[!@#\$%\^&\*])/.test(e.target.value) && 
                        /(?=.*[A-Z])/.test(e.target.value) && /(?=.*[a-z])/.test(e.target.value) && /(?=.{8,})/.test(e.target.value));
                  }}/>
            { error && 
            <div style={{ color: "red", textAlign: "center" }}>
              {error}
            </div>
            }
              {/* <div style={{ margin: "20px 0px", display: "flex", justifyContent: "space-around" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <input type="checkbox" checked={numbers}/>
                  <div>Number</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <input type="checkbox" checked={specialChars}/>
                  <div>Special Character</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <input type="checkbox" checked={upperLetters}/>
                  <div>Uppercase</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <input type="checkbox" checked={lowerLetters}/>
                  <div>Lowercase</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <input type="checkbox" checked={minimum8}/>
                  <div>8+ characters</div>
                </div>
              </div> */}
              <input required="required" value={checkbox} onChange={e => setCheckbox(!checkbox)} type="checkbox"/><span>I have read the terms and conditions and privacy policy</span>
            </div>
            <button disabled={!readyToSubmit && checkbox && username.length > 2} type="submit" style={{ outline: "none", height: "67px", width: "211px", backgroundColor: (readyToSubmit && checkbox && username.length > 2) ? "#00b6fb" : "gray", borderRadius: "34px",
                textAlign: "center", fontSize: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white" }}>
            Submit
            </button>

          </form>
      </div>
    </div> : null
  );
}

export default Register;