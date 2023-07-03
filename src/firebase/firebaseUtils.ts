import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import firebaseApp from "./app-config";
import { getStorage, uploadBytes } from 'firebase/storage';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';





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

const storage = getStorage(firebaseApp);

export const uploadFile = async (file: Express.Multer.File, path: string): Promise<string> => {
  try {
    const fileName = file.originalname; 
    const storageRef = ref(storage, path + "/" + fileName); 
    await uploadBytes(storageRef, file.buffer, { contentType: file.mimetype }); // Upload file
    const downloadURL = await getDownloadURL(storageRef);
    console.log('File uploaded successfully. Download URL:', downloadURL);
    return downloadURL;
  } catch (err) {
    console.log("Failed uploading file: ", err);
    return ""
  }
}


