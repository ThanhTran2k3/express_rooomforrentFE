import React, { useEffect } from 'react';
import { useUser } from '../../UserContext';
import { useNavigate } from 'react-router-dom';
import FormService from './FormService';
import FormRoomType from './FormRoomType';

const CreateRoomType = () => {
    const { userInfo  } = useUser();
    const navigate = useNavigate()

    useEffect(()=>{
        if (!userInfo) {
            navigate('/login');
        }
    })
    return (
        <div>
            <FormRoomType
                roomType = {{}}
            />
        </div>
    );
};

export default CreateRoomType;