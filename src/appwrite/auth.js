import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;
    
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
            
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another method
                return this.login({email, password});
            } else {
               return  userAccount;
            }
        } catch (error) {
            console.error("AuthService :: createAccount :: error", error);
            throw error;
        }
    }

    async login({email, password}) {
        try {
            session=await this.account.createEmailSession(email, password);
            return session;
        } catch (error) {
            console.error("AuthService :: login :: error", error);

            if (error.code === 401) {
                console.error("Unauthorized: Invalid credentials or session expired.");
            }
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const currentUser = await this.account.get();
            console.log("Current user:", currentUser);
            return currentUser;
        } catch (error) {
            console.error("AuthService :: getCurrentUser :: error", error);
            if (error.code === 401) {
                console.error("Unauthorized: User is not authenticated.");
            }
            return null;
        }
    }

    async logout() {

        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Appwrite serive :: logout :: error", error);
        }
    }
}



const authService = new AuthService();

export default authService

