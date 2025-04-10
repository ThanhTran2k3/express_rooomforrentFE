import React, { useEffect, useState } from 'react';
import { useUser } from '../../UserContext';
import { useParams } from 'react-router-dom';
import FormRoomType from './FormRoomType';
import { getRoomTypeByName } from '../../api/roomTypeApi';

const EditRoomType = () => {
    const { userInfo  } = useUser();
    const [roomType, setRoomType] = useState({})
    const { typeName } = useParams()

    useEffect(()=>{
        const fetchData = async () => {
            const roomType = await getRoomTypeByName(typeName);
            setRoomType(roomType)
        };
        fetchData();
       
    },[typeName,userInfo])

    return (
        <div>
            <FormRoomType
                roomType = {roomType}
            />
        </div>
    );
};

export default EditRoomType;