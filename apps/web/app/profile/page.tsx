import {getSession} from "@/lib/session";
import {getProfile} from "@/lib/actions";

const ProfilePage = async () => {
    const res = await getProfile();
    return(
        <div>
            <p>{JSON.stringify(res)}</p>
        </div>
    )
}

export default ProfilePage;