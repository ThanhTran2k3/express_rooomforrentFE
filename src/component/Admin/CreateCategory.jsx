import React, { useEffect } from 'react';
import { useUser } from '../../UserContext';
import { useNavigate } from 'react-router-dom';
import FormCategory from './FormCategory';


const CreateCategory = () => {
    const { userInfo  } = useUser();
    const navigate = useNavigate()

    useEffect(()=>{
        if (!userInfo) {
            navigate('/login');
        }
    })
    return (
        <div>
            <FormCategory
                category = {{}}
            />
        </div>
    );
};

export default CreateCategory;