import axios from "axios";
import Swal from "sweetalert2";


const authApi ="http://localhost:8000/auth"

export const login = async (data,updateUser,navigate) =>{
    await axios.post(`${authApi}/login`,data,{
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response =>{
        sessionStorage.setItem("userinfo", JSON.stringify(response.data.data));
        updateUser(response.data.data);
        
        if(response.data.data.role === ('Admin'))
            navigate('/admin/manager/user')
        else
            navigate('/');
        
    }).catch(error =>{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.message,
            });
    })
  
}

export const register = async (formData,navigate) =>{

    await axios.post(`${authApi}/signup`, formData, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/login');
    }).catch(error =>{
        const errorMessage = error.response.data.message;
        Swal.fire({
            icon: "error",
            title: "Error",
            html: Array.isArray(errorMessage)?errorMessage
            .map(err => err.msg)                     
            .map(msg => msg + '<br>')             
            .join('')
            :error.response.data.message
        });
    });
   
}

export const changePass = async (userInfo,formData,navigate,logout) =>{

    await axios.put(`${authApi}/changepassword`, formData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        Swal.fire({
            title: "Bạn chắc chắn?",
            text: "Bạn đã đổi mật khẩu thành công.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đăng xuất",
            cancelButtonText: "Để sau"
          }).then((result) => {
            if (result.isConfirmed) {
              logout()
              navigate('/login');
              Swal.fire({
                title: "Đăng xuất!",
                text: "Bạn đã đăng xuất thành công.",
                icon: "success"
              });
            }
          });
    }).catch(error =>{
        const errorMessage = error.response.data.message;
        Swal.fire({
            icon: "error",
            title: "Error",
            html: Array.isArray(errorMessage)?errorMessage
            .map(err => err.msg)                     
            .map(msg => msg + '<br>')             
            .join('')
            :error.response.data.message
        });
    });
   
}

export const changePassOTP = async (formData,navigate,logout) =>{

    await axios.put(`${authApi}/changepasswordOTP`, formData, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response =>{
        navigate('/');
        Swal.fire({
            title: "Đổi mật khẩu thành công!",
            icon: "success",
            draggable: true
        });
    }).catch(error =>{
        const errorMessage = error.response.data.message;
        Swal.fire({
            icon: "error",
            title: "Error",
            html: Array.isArray(errorMessage)?errorMessage
            .map(err => err.msg)                     
            .map(msg => msg + '<br>')             
            .join('')
            :error.response.data.message
        });
    });
   
}

export const refreshToken = async (userInfo,updateUser)=>{
    await axios.get(`${authApi}/refreshToken`,{
        headers: {
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        sessionStorage.setItem("userinfo", JSON.stringify(response.data.result));
        updateUser(response.data.result);
    })
   
}


export const me = async (userInfo,navigate) =>{
    try{
        const response = await axios.get(`${authApi}/me`,{
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        return response.data.data
        
    }catch(error){
        navigate('/error');
        return {}; 
    }
}
export const sendOTPEmail = async (data) =>{

    try {
        const response =  await axios.post(`${authApi}/send-email`,data,{
            
        })
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.message 
            });
        return false
    }
  
}
export const verifyOTPEmail = async (email,otp) =>{
    try {
        const response = await axios.post(`${authApi}/verify-otp`,{},{
            params: {
                otp: otp,
                email: email
            },
        })
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.message
            });
        return false
    }
}