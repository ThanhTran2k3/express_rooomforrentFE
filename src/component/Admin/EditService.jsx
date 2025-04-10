import React, { useEffect, useState } from 'react';
import { useUser } from '../../UserContext';
import { useParams } from 'react-router-dom';
import {  getServiceByName } from '../../api/serviceApi';
import FormService from './FormService';

const EditService = () => {
    const { userInfo  } = useUser();
    const [service, setService] = useState({})
    const { serviceName } = useParams()

    useEffect(()=>{
        const fetchData = async () => {
            const service = await getServiceByName(serviceName);
            setService(service)
        };
        fetchData();
       
    },[serviceName,userInfo])

    return (
        <div>
            <FormService
                service = {service}
            />
        </div>
    );
};

export default EditService;