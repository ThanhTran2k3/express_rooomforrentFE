import axios from "axios";
import Swal from "sweetalert2";

const serviceApi = 'http://localhost:8000/service'

export const getServiceByName = async (name) =>{
    try{
        const response = await axios.get(`${serviceApi}/${name}`)
        return response.data.data
    }catch(error){
        return {}; 
    }
}

export const getServicess = async()=>{
    try{
        const response = await axios.get(`${serviceApi}/user`,{
        
        })
        return response.data.data
    }catch(error){
    
        return []; 
    }
}

export const getListService = async(page,status)=>{
    try{
        const response = await axios.get(`${serviceApi}`,{
            params: {
                page: page,
                status: status
            },  
        })
        return response.data.data
    }catch(error){
    
        return []; 
    }
}

export const addService = async (userInfo,formData,navigate) =>{

    await axios.post(`${serviceApi}`, formData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/admin/manager/service');
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

export const editService = async(userInfo,serviceId,formData,navigate) =>{

    await axios.put(`${serviceApi}/${serviceId}`, formData, {
        headers: {
           'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/admin/manager/service');
    }).catch(error =>{
        const errorMessage = error.response.data.error;
        Swal.fire({
            icon: "error",
            title: "Error",
            html: errorMessage
        });
    });
}

export const showService = async(userInfo,serviceId) =>{

    await axios.delete(`${serviceApi}/${serviceId}`, {
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