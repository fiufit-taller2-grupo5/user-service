import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import firebaseApp from "./app-config";

export const sendResetPasswordEmail = async (email: string): Promise<boolean> => {
  try {
    const auth = getAuth(firebaseApp);
    await sendPasswordResetEmail(auth, email);
    console.log("Successfully sent reset password email to: ", email);
    return true
  } catch(err) {
    console.log("Failed sending reset password email: ", err);
    return false
  }
}

