import React, { createRef, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useUser } from '../../UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { addRoom, editRoom } from '../../api/roomTypeApi';

const FormRoomType = (props) => {
    const [roomType, setRoomType] = useState(props.roomType);
    const { userInfo } = useUser();
    const navigate = useNavigate();
    const roomTyperef = createRef();
    const location = useLocation().pathname;

    useEffect(()=>{
        if (props.roomType) {
            setRoomType(props.roomType);  
        }
    },[props.roomType])
    
    const handleService = async (event) => {
        event.preventDefault()
        const roomTypeName = roomTyperef.current.value.trim();

       
        if (!roomTypeName) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập đầy đủ thông tin!",
            });
            return;
        }

        const data = { 
            typeName: roomTypeName,
        };

        if(location==='/admin/manager/roomType/add'){
            await addRoom(userInfo,data,navigate)
        }
        else
            await editRoom(userInfo,roomType._id,data,navigate)
        
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRoomType((prevService) => ({
            ...prevService,
            [name]: value
        }));
    };

    return (
        <div className='d-flex justify-content-center align-items-center flex-column'>
            <img src='/roomType.jpg' alt='ảnh service' className='anh-service mt-5'/>
            <div className="form-03-main w-40 mx-auto p-5">
                <div className="form-floating mb-4 d-flex">
                    <input value={roomType.typeName|| ''} onChange={handleInputChange} name="typeName" type="text" className="form-control" ref={roomTyperef} required/>
                    <label className="control-label">Tên loại phòng</label>
                </div>


                <button onClick={handleService} className="button-info payment">
                    <label>{roomType?'Lưu':'Thêm mới'}</label>
                </button>
            </div>  
        </div>
    );
};

export default FormRoomType;