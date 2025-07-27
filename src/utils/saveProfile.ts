import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

// profile: object matching your myProfile.json structure
export async function saveUserProfile(uid: string, profile: any) {
  try {
    await setDoc(doc(db, "users", uid, "profile", "main"), profile);
    return { success: true };
  } catch (error) {
    console.error("Failed to save user profile:", error);
    return { success: false, error };
  }
}
