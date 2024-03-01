import {
    getAuth,
    createUserWithEmailAndPassword,
    FacebookAuthProvider,
    signInWithPopup,
    signInWithRedirect,
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