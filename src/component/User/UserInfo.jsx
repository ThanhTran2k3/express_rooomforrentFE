import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getInfoUser } from '../../api/userApi';
import { useUser } from '../../UserContext';
import moment from 'moment';
import PostList from '../Post/PostList';
import Reviews from './Reviews'



const UserInfo = () => {
    const { userInfo } = useUser();

    const [selectedAction, setSelectedAction] = useState(null);
    const [user, setUser] = useState({})
    
    const { userName } = useParams()
    const currentUserName = userName || userInfo.userName;
    const [activeButton, setActiveButton] = useState('post');
    const location = useLocation().pathname;
    const navigate = useNavigate();

    useEffect(()=>{
        
        const fetchData = async () => {
            const result = await getInfoUser(currentUserName,navigate)
                setUser(result)
        };
        
        fetchData();
        setSelectedAction(<PostList postType={'postDisplays'}/>);
        window.scrollTo(0, 0); 
    },[currentUserName,navigate])


    
    const handleButtonClick = (action,buttonName) => {
        setSelectedAction(action);
        setActiveButton(buttonName)
    };


    return (
        <div className={`row ${location===`/user/${userName}`?'ms-0':''}`}>
            <div className="col-md-12 d-flex ps-0">
                <div className="col-md-3">
                    <div className="info h-100">
                        <div className="avatar-user">
                            <img src={`${user.avatar}`} alt="" className="avatar" />
                        </div>
                        <h4 className="p-5px text-center">{user.userName}</h4>
                        <label>
                            <i className="fa-solid fa-phone w-20"></i>
                            <span>{user.phoneNumber}</span>
                        </label>
                        <label>
                            <i className="fa-solid fa-at w-20"></i>
                            <span>{user.email}</span>
                        </label>
                        <label>
                            <i className="fa-solid fa-location-dot w-20"></i>
                            <span>{`${!user.district||!user.city?'Chưa cập nhật':`${user.district}, ${user.city}`}`}</span>
                        </label>
                        <label>
                            <i className="fa-solid fa-calendar-days w-20"></i>
                            <span>Ngày tham gia: {moment(user.createdAt).format('DD-MM-YYYY')}</span>
                        </label>
                        {/* {userInfo&&userInfo.userName!==user.userName &&(
                            <button className="button-info report mt-3">
                                <label>
                                    <i className="fa-solid fa-circle-info w-20"></i>
                                    <span>Báo cáo tài khoản</span>
                                </label>
                            </button>
                        )} */}
                    </div>
                </div>

                <div className="col-md-9 m-2">
                    <div className='btn-option'>
                        <button className={`btn ${activeButton==='post'?'red-underline':''}`} onClick={() => handleButtonClick(<PostList postType={'postDisplays'}/>,'post')}>
                            Tin đăng
                        </button>
                        <button className={`btn ${activeButton==='reviews'?'red-underline':''}`} onClick={() => handleButtonClick(<Reviews user={user}/>,'reviews')}>
                            Đánh giá
                        </button>
                    </div>
                   

                    <div style={{ flex: 1}}>
                        {selectedAction}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;