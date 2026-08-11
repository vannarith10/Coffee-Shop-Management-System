import api from "../lib/axios";


export async function getUserProfile () {
    return api.get("/api/v2/user/profile");
}