import {NextRequest, NextResponse} from "next/server";
import {deleteSession} from "@/lib/session";
import {revalidatePath} from "next/cache";

export async function GET(req: NextRequest){
    await deleteSession()

    revalidatePath("/")
    return NextResponse.redirect(new URL("/", req.nextUrl))
}