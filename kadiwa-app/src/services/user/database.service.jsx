import { getDatabase, ref } from "firebase/database";
import { app } from './../init/firebase.init';

const database = getDatabase(app);

//USERS REFERENCE
export const userswalletRef =  ref(database, 'user_wallet');
export const usersRef =  ref(database, 'users_information');
export const usersAddressRef =  ref(database, 'users_address');
export const usersAuthRef =  ref(database, 'authentication');
export const storesRef =  ref(database, 'store_information');

