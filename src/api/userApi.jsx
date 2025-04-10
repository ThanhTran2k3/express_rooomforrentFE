import axios from 'axios';
import Swal from 'sweetalert2';


const userApi ='http://localhost:8000/user'


export const getInfoUser = async (userName,navigate) =>{
    try{
        const response = await axios.get(`${userApi}/${userName}`)
        return response.data.data
        
    }catch(error){
        navigate('/error');
        return {}; 
    }
}


export const editUser = async(formData,userInfo,updateUser)=>{
    try{
        const response = await axios.put(`${userApi}/edit`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userInfo.token}`
            }
        })
            sessionStorage.setItem('userinfo', JSON.stringify(response.data.data));
            updateUser(response.data.data)
            Swal.fire({
                icon: "success",
                title: "Cập nhật thành công!",
                timer: 2000,
                showConfirmButton: false,
              });
    }catch(error){
        const errorMessage = error.response.data.message;
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    html: errorMessage
                        .map(err => err.msg)                     
                        .map(msg => msg + '<br>')             
                        .join('')
                });
    }
}

export const getRoleUser = async(userInfo,status,page)=>{
    try{
        const response = await axios.get(`${userApi}`, {
            params:{
                status: status,
                page: page
            },
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        return response.data.data   
    }catch(error){
        console.error(`Error `, error);
    }
}


export const blockUser = async(userInfo,userId) =>{

    await axios.delete(`${userApi}/${userId}`, {
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

export const addEmployee = async (userInfo,formData,navigate) =>{

    await axios.post(`${userApi}/add/employee`, formData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/admin/manager/employee');
    }).catch(error =>{
        const errorMessage = error.response.data.error;
        if(error.response.status!==401){
            Swal.fire({
                icon: "error",
                title: "Error",
                html: errorMessage.map(err => `${err.split(':')[1]}<br>`).join('')
            });
        }
        
    });
   
}