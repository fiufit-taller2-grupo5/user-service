import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import firebaseApp from "./app-config";
// import storage from "./storage-config";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const sendResetPasswordEmail = async (email: string): Promise<boolean> => {
  try {
    const auth = getAuth(firebaseApp);
    await sendPasswordResetEmail(auth, email);
    console.log("Successfully sent reset password email to: ", email);
    return true
  } catch (err) {
    console.log("Failed sending reset password email: ", err);
    return false
  }
}


// export const uploadFileToFirebaseStorage = async (file: any, path: string): Promise<string> => {
//   try {
//     const storageRef = ref(storage, path);
//     const snapshot = await uploadBytes(storageRef, file);
//     const downloadURL = await getDownloadURL(snapshot.ref);
//     console.log("Successfully uploaded file to: ", downloadURL);
//     return downloadURL;
//   } catch (err) {
//     console.log("Failed uploading file: ", err);
//     throw err;
//   }
// }