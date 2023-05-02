import firebase from "./config";

export const getResetPasswordUrl = async (email: string): Promise<string> => {
  const url = await firebase.auth().generatePasswordResetLink(email);
  return url;
};
