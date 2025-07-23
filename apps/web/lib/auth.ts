"use server"

import {FormState, LoginFormSchema, SignupFormSchema} from "@/lib/type";
import {BACKEND_URL} from "@/lib/constants";
import { redirect } from "next/navigation";
import {createSession} from "@/lib/session";

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

export async function signIn(
    state: FormState,
    formData: FormData
): Promise<FormState> {
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const response = await fetch(
        `${BACKEND_URL}/auth/signin`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validatedFields.data),
        }
    );

    if (response.ok) {
        const result = await response.json();
        console.log({result})
        // TODO: Create The Session For Authenticated User.
        await createSession({
            user: {
                id: result.id,
                name: result.name,
                // role: result.role,
            },
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
        redirect("/");


    } else {
        return {
            message: response.status === 401 ? "Invalid Credentials!" : response.statusText,
        }
    }
}


export const refreshToken = async (
    oldRefreshToken: string
) => {
    try {
        const response = await fetch(
            `${BACKEND_URL}/auth/refresh`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh: oldRefreshToken,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to refresh token" + response.statusText
            );
        }

        const { accessToken, refreshToken } =
            await response.json();
        // update session with new tokens
        const updateRes = await fetch(
            "http://localhost:3000/api/auth/update",
            {
                method: "POST",
                body: JSON.stringify({
                    accessToken,
                    refreshToken,
                }),
            }
        );
        if (!updateRes.ok)
            throw new Error("Failed to update the tokens");

        return accessToken;
    } catch (err) {
        console.error("Refresh Token failed:", err);
        return null;
    }
};