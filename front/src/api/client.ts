import {Api} from "@/api/axios.ts";

const postClient = async(registrationStatus:string, name:string, topic:string, contactNumber:string, gender:string, birth:string) => {
    console.log(birth)
    return Api.post("/api/clients", {
        registrationStatus,
        name,
        topic,
        contactNumber,
        gender,
        birth,
    })
}

export {postClient}
