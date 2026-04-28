import { useEffect, useState } from "react";
import { auth } from "../firebase/auth";
import { db } from "../firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export function useUser() {
  const [firebaseUser, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!firebaseUser) return;

    const fetchUser = async () => {
      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserData(snap.data());
      }
    };

    fetchUser();
  }, [firebaseUser]);

  return { user: firebaseUser, userData, loading };
}