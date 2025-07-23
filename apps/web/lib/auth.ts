"use server"

import {FormState, SignupFormSchema} from "@/lib/type";
import {BACKEND_URL} from "@/lib/constants";
import { redirect } from "next/navigation";

export async function signUp(
    state: FormState,
    formData: FormData
): Promise<FormState>{

    const validationFields = SignupFormSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        // passwordConfirmation: formData.get("passwordConfirmation"),
    });

    if(!validationFields.success){
        return {
            error: validationFields.error.flatten().fieldErrors
        }
    }

    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(validationFields.data)
    });
    if(response.ok){
        redirect("/auth/signin")
    }
    else
        return{
        message: response.status === 409 ? "The user already exists" : response.statusText,
        }

}