import React, { createRef, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useUser } from '../../UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { addRoom, editRoom } from '../../api/roomTypeApi';
import { addCategory, editCategory } from '../../api/categoryApi';

const FormCategory = (props) => {
    const [category, setCategory] = useState(props.category);
    const { userInfo } = useUser();
    const navigate = useNavigate();
    const roomTyperef = createRef();
    const location = useLocation().pathname;

    useEffect(()=>{
        if (props.category) {
            setCategory(props.category);  
        }
    },[props.category])
    
    const handleService = async (event) => {
        event.preventDefault()
        const categoryName = roomTyperef.current.value.trim();

       
        if (!categoryName) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập đầy đủ thông tin!",
            });
            return;
        }

        const data = { 
            categoryName: categoryName,
        };

        if(location==='/admin/manager/category/add'){
            await addCategory(userInfo,data,navigate)
        }
        else
            await editCategory(userInfo,category._id,data,navigate)
        
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCategory((prevService) => ({
            ...prevService,
            [name]: value
        }));
    };

    return (
        <div className='d-flex justify-content-center align-items-center flex-column'>
            <img src='/roomType.jpg' alt='ảnh service' className='anh-service mt-5'/>
            <div className="form-03-main w-40 mx-auto p-5">
                <div className="form-floating mb-4 d-flex">
                    <input value={category.categoryName|| ''} onChange={handleInputChange} name="categoryName" type="text" className="form-control" ref={roomTyperef} required/>
                    <label className="control-label">Tên loại bài đăng</label>
                </div>


                <button onClick={handleService} className="button-info payment">
                    <label>{category?'Lưu':'Thêm mới'}</label>
                </button>
            </div>  
        </div>
    );
};

export default FormCategory;