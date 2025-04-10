import React, { useEffect, useState } from 'react';
import { useUser } from '../../UserContext';
import { useNavigate } from 'react-router-dom';
import PostList from './PostList';


const ManagerPost = () => {

    const [selectedAction, setSelectedAction] = useState(<PostList/>);
    const [activeButton, setActiveButton] = useState('postDisplays');
    const { postOfUser } = useUser();
    const navigate = useNavigate()


    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName)
        navigate('');
    };
    useEffect(()=>{
        if (activeButton) {
            setSelectedAction(<PostList postType={activeButton}/>)
        }
    },[activeButton,postOfUser])

    return (
        
        <div className='manager-post'>
            <div className='btn-postpption'>
                <button className={`btn ${activeButton==='postDisplays'?'red-underline':''}`} onClick={() => handleButtonClick('postDisplays')}>
                    Tin đang hiển thị
                </button>
                <button className={`btn ${activeButton==='postHidden'?'red-underline':''}`} onClick={() => handleButtonClick('postHidden')}>
                    Tin đang ẩn
                </button>
                <button className={`btn ${activeButton==='postExpired'?'red-underline':''}`} onClick={() => handleButtonClick('postExpired')}>
                    Tin hết hạn
                </button>
                <button className={`btn ${activeButton==='postPending'?'red-underline':''}`} onClick={() => handleButtonClick('postPending')}>
                    Tin chờ duyệt
                </button>
                <button className={`btn ${activeButton==='postRejected'?'red-underline':''}`} onClick={() => handleButtonClick('postRejected')}>
                    Tin bị từ chối
                </button>
            </div>
                <div style={{ flex: 1}}>
                    {selectedAction}
                </div>
            </div>
    );
};

export default ManagerPost;