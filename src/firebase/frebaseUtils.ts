import firebase from "./config";

export const getResetPasswordUrl = async (email: string): Promise<string> => {
  console.log(`About to generate password reset link for email: ${email}`);
  const url = await firebase.auth().generatePasswordResetLink(email);
  console.log(`Received url: ${url}`);
  return url;
};
