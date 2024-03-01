import {
    getAuth,
    createUserWithEmailAndPassword,
    FacebookAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    signInWithCredential,
    signOut,
} from 'firebase/auth';

import { app } from './../init/firebase.init';


const auth = getAuth(app);


const fb_auth_provider = new FacebookAuthProvider();


export async function CreateNewUser (email, password, uid , provider){
    
}

export const FacebookAuth = async () => {
    const fbAuth = await  signInWithPopup(auth, fb_auth_provider);
    return fbAuth;
    
}

// auth.jsx
// export const FacebookAuth = async () => {
//     try {
//         await signInWithRedirect(auth, fb_auth_provider);
//     } catch (error) {
//         console.error("Error occurred during Facebook authentication:", error);
//         throw error;
//     }
// }


export const Logout = async () => {
    try {
        await signOut(auth);
        console.log("User logged out successfully.");
        // Optionally, you can redirect the user or perform any other action after logout.
    } catch (error) {
        console.error("Error occurred while logging out:", error.message);
        // Handle error
    }
}


// Function to authenticate with Facebook
// export const FacebookMobileAuth = () => {

//     const result = signInWithRedirect(auth, fb_auth_provider);
//     return result;

// }
