import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom"
import { confirmUser } from "../../../actions/userActions";

const Confirm = ({ id }) => {

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("testing!!!")
    dispatch(confirmUser({ username: "placeholder", confirmationId: id }));
  }, [])

  return (
    <div>
      Confirming buddy... {id}
      <Redirect to="/" />
    </div>
  );
}

export default Confirm;