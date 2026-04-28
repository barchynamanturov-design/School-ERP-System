import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "./firebaseConfig";

const auth = getAuth(app);

// LOGIN
export const loginUser = async (email, password) => {
  const user = await signInWithEmailAndPassword(auth, email, password);
  return user.user;
};

// LOGOUT
export const logoutUser = async () => {
  await signOut(auth);
};

export { auth };