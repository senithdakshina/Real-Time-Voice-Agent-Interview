'use server';

import { cookies } from "next/headers";
import { auth, db } from "@/firebase/admin";


const ONE_WEEK = 60*60*24*7 *1000;

export async function SignUp(params:SignUpParams) {
  


    const { uid,name,email } = params;

    try{
       const userRecord = await db.collection("users").doc(uid).get();
        if(userRecord.exists){
            return{
                success :false,
                message :"User already exists. please sign in insted!!"
            }
        }

        await db.collection('users').doc(uid).set({
            name,email
        })

    }catch(e : any){
        console.error('Error creating User :',e);
        if(e.code === 'auth/email-already-exists'){
            return{
                success:false,
                message: "This email is already in use"
            }
        }
        return {
            success:false,
            message:"Failed to create an account"
        }
    }
    
}

export async function setSessionCookie(idToken:string) {
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn : ONE_WEEK,
    })

    cookieStore.set('session' ,sessionCookie {
        maxAge :ONE_WEEK,
        httpOnly : true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    }) 

    
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };

    await setSessionCookie(idToken);
  } catch (error: any) {
    console.log("");

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}