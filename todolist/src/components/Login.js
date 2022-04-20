import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

const provider = new GoogleAuthProvider();

const Login = () => {
  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      console.log(user);
    });
  };

  return (
    <div>
      <br />
      <button value="Log In" onClick={signInWithGoogle}>
        Log in
      </button>
    </div>
  );
};

export default Login;
