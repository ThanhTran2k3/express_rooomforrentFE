import React, { useEffect, useState } from 'react';
import { useUser } from '../../UserContext';
import { useParams } from 'react-router-dom';
import FormCategory from './FormCategory';
import { getCategoryByName } from '../../api/categoryApi';

const EditCategory = () => {
    const { userInfo  } = useUser();
    const [category, setCategory] = useState({})
    const { categoryName } = useParams()

    useEffect(()=>{
        const fetchData = async () => {
            const categorys = await getCategoryByName(categoryName);
            setCategory(categorys)
        };
        fetchData();
       
    },[categoryName,userInfo])

    return (
        <div>
            <FormCategory
                category = {category}
            />
        </div>
    );
};

export default EditCategory;