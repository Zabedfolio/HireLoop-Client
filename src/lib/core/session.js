import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";



export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers() // some endpoints might require headers
    })
    return session?.user || null;
}


export const requireRole = async(role)=>{
    const user = await getUserSession()
    if(!user){
        redirect('/auth/signin')
    }
    if(user?.status === 'suspended'){
        redirect('/unauthorized?reason=suspended')
    }
    if(user?.role !== role){
        redirect('/unauthorized')
    }
    return user;
}