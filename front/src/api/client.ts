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

const getClients = async() => {
    return Api.get("/api/clients/assigned-clients")
}

const postAnalysis = async(clientId:string, audioFile:Blob) => {
    const formData = new FormData();
    formData.append("file", audioFile);
    return Api.post(`/api/sessions/${clientId}/analyze-recording`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    } )
}

export {postClient, getClients, postAnalysis}
