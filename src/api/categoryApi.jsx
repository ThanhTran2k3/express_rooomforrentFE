import axios from "axios";
import Swal from "sweetalert2";

const categoryApi = 'http://localhost:8000/category'

export const getCategory = async (page,status) =>{
    try{
        const response = await axios.get(`${categoryApi}`,{
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
export const getCategoryByName = async (name) =>{
    try{
        const response = await axios.get(`${categoryApi}/${name}`)
        return response.data.data
    }catch(error){
        return {}; 
    }
}
export const addCategory = async (userInfo,formData,navigate) =>{

    await axios.post(`${categoryApi}`, formData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/admin/manager/category');
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

export const showCategory = async(userInfo,categoryId) =>{

    await axios.delete(`${categoryApi}/${categoryId}`, {
        headers: {
            Authorization: `Bearer ${userInfo.token}`
        }
    }).catch(error =>{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.message
            });
    })
   
}

export const editCategory = async(userInfo,categoryId,formData,navigate) =>{

    await axios.put(`${categoryApi}/${categoryId}`, formData, {
        headers: {
           'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/admin/manager/category');
    }).catch(error =>{
        const errorMessage = error.response.data.message;
        Swal.fire({
            icon: "error",
            title: "Error",
            html: errorMessage
        });
    });
}