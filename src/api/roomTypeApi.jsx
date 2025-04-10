import axios from "axios";
import Swal from "sweetalert2";

const roomTypeApi = 'http://localhost:8000/room'

export const getRoomType = async (page,status) =>{
    try{
        console.log(status)
        const response = await axios.get(`${roomTypeApi}`,{
            params: {
                page: page,
                status: status
            },  
        })
        return response.data.data
    }catch(error){
        console.error('Error get room type:', error);
        return []; 
    }
}
export const getRoomTypeByName = async (name) =>{
    try{
        const response = await axios.get(`${roomTypeApi}/${name}`)
        return response.data.data
    }catch(error){
        return {}; 
    }
}
export const addRoom = async (userInfo,formData,navigate) =>{

    await axios.post(`${roomTypeApi}`, formData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/admin/manager/roomType');
    }).catch(error =>{
        const errorMessage = error.response.data.message;
        if(error.response.status!==401){
            Swal.fire({
                icon: "error",
                title: "Error",
                html: errorMessage
            });
        }
        
    });
   
}

export const showRoomType = async(userInfo,serviceId) =>{

    await axios.delete(`${roomTypeApi}/${serviceId}`, {
        headers: {
            Authorization: `Bearer ${userInfo.token}`
        }
    }).catch(error =>{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
    })
   
}

export const editRoom = async(userInfo,roomTypeId,formData,navigate) =>{

    await axios.put(`${roomTypeApi}/${roomTypeId}`, formData, {
        headers: {
           'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/admin/manager/roomType');
    }).catch(error =>{
        const errorMessage = error.response.data.message;
        Swal.fire({
            icon: "error",
            title: "Error",
            html: errorMessage
        });
    });
}