import axios from "axios";
import Swal from "sweetalert2";

const reviewsApi ="http://localhost:8000/review"

export const getReviews = async (userId,page) => {

    try{
        const response  = await axios.get(`${reviewsApi}/${userId}`,{
            params: {
                page: page,
            },  
        })
        return response.data.data
    } catch (error) {
        console.error('Error get reviews:', error);
        return []; 
    }
};

export const addReviews = async (userInfo,formData,userId, navigate) =>{

    await axios.post(`${reviewsApi}/${userId}`, formData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
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

export const edirReview = async (userInfo,formData,reviewId, navigate) =>{

    await axios.put(`${reviewsApi}/${reviewId}`, formData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    })
    .then(response => {
    })
    .catch(error => {
        const errorMessage = error.response.data.message;
        if (error.response.status !== 401) {
            Swal.fire({
                icon: "error",
                title: "Error",
                html: errorMessage
            });
        }
    });
    
   
}

export const showReviews = async(userInfo,reviewsId) =>{

    await axios.delete(`${reviewsApi}/${reviewsId}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      }).catch(error => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.error || "Đã xảy ra lỗi"
        });
      });
   
}