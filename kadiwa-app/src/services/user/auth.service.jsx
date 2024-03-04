import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    FacebookAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    signInWithCredential,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
} from 'firebase/auth';

import { app } from './../init/firebase.init';


const auth = getAuth(app);



const fb_auth_provider = new FacebookAuthProvider();
const google_auth_provider = new GoogleAuthProvider();




export const FacebookAuth = async () => {
    const fbAuth = await  signInWithPopup(auth, fb_auth_provider);
    return fbAuth;
    
}

export const GoogleAuth = async () => {
    const googleAuth = await  signInWithPopup(auth, google_auth_provider);
    return googleAuth;
    
}


export async function createUserWithEmailAndPasswordFunc(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // User created successfully
        const user = userCredential.user;
        
        // Send verification email
        await sendEmailVerification(auth.currentUser);
        
        console.log('User created:', user.uid);
        return user;
    } catch (error) {
        // Handle errors
        console.error('Error creating user:', error.message);
        throw error;
    }
}

export async function signInWithEmailAndPasswordFunc(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // User signed in successfully
        const user = userCredential.user;
        console.log('User signed in:', user.uid);
        return user;
    } catch (error) {
        // Handle errors
        console.error('Error signing in:', error.message);
        throw error;
    }
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

// Function to handle forgot password
export async function forgotPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log('Password reset email sent successfully');
    } catch (error) {
        // Handle errors
        console.error('Error sending password reset email:', error.message);
        throw error;
    }
}


// Function to authenticate with Facebook
// export const FacebookMobileAuth = () => {

//     const result = signInWithRedirect(auth, fb_auth_provider);
//     return result;

// }
