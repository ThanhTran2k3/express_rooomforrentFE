import React, { useEffect, useState } from 'react';
import './User.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { getInfoUser } from '../../api/userApi';
import EditUser from './EditUser';
import CreatePost from '../Post/CreatePost';
import { useUser } from '../../UserContext';
import UserInfo from './UserInfo';
import ManagerPost from '../Post/ManagerPost';
import EditPost from '../Post/EditPost';
import ExtendPost from '../Post/ExtendPost';
import PostService from '../Post/PostService';
import HistoryPayment from '../Payment/HistoryPayment';
import ChangePass from './ChangePass';
import { me } from '../../api/authApi';

const UserDashboard = () => {
    const [currentContent, setCurrentContent] = useState(null);
    const navigate = useNavigate();
    const [user,setUser] = useState({})
    const [activeButton, setActiveButton] = useState(null);
    const { userInfo } = useUser();
    const location = useLocation(); 

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);


    useEffect(() => {
        const fetchData = async () => {

                const user = await me(userInfo,navigate)
                setUser(user);
           
        };
    
        if (userInfo) {  
            fetchData();
        }
    }, [userInfo,navigate]);



    useEffect(() => {

        if (location.pathname === '/user/manager') {
            setCurrentContent(<UserInfo />);
            setActiveButton('')
        } else if (location.pathname === '/user/manager/post/create') {
            setCurrentContent(<CreatePost />);
            setActiveButton('createPost')
        } else if (location.pathname === '/user/manager/post') {
            setCurrentContent(<ManagerPost />);
            setActiveButton('postManager')
        } else if (location.pathname.includes('/user/manager/post/edit/')) {
            setCurrentContent(<EditPost />);
        } else if (location.pathname.includes('/user/manager/post/extend/')) {
            setCurrentContent(<ExtendPost user={user} />);
        } else if (location.pathname.includes('/user/manager/post/service/')) {
            setCurrentContent(<PostService user={user} />);
        } else if (location.pathname === '/user/manager/edit/profile') {
            setCurrentContent(<EditUser />);
            setActiveButton('userProfile')
        } else if (location.pathname === '/user/manager/payment/history') {
            setCurrentContent(<HistoryPayment />);
            setActiveButton('historyMoney')
        }
        else{
            setCurrentContent(<ChangePass />);
            setActiveButton('changePass')
        }
            
        
    }, [location.pathname, user]);



    const handleNavigation = (content,buttonName) => {
         setCurrentContent(content);
         setActiveButton(buttonName);
         if(buttonName==='createPost')
             navigate('/user/manager/post/create')
         else if(buttonName==='postManager')
             navigate('/user/manager/post')
         else if(buttonName==='userProfile')
             navigate('/user/manager/edit/profile')
         else if(buttonName==='userInfo')
             navigate('/user/manager')
         else if(buttonName==='historyMoney')
            navigate('/user/manager/payment/history')
        else
            navigate('/user/manager/change/password')

     };

    const exitClick = () => {
        navigate('/')
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) {
            return 'N/A';
        }
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ';
    }

   

    return (
        <div className='d-flex w-100'>
             <div className='user-dashboard'>
                <div className="user-info d-flex">
                        <div className="avatar-user">
                            <img src={`${user.avatar}`} alt="" className="avatar" />
                        </div>
                        <div className='user-details'>
                            <button className='userName-click' onClick={() => handleNavigation(<UserInfo />,'userInfo')}>
                                <label>{user.userName}</label>
                            </button>
                        </div>
                    
                </div>
                <div className='dashboard'>
         
                    <button className={activeButton === 'createPost' ? 'button-click' : ''} onClick={() => handleNavigation(<CreatePost />,'createPost')}>
                        <label>
                            <i className="fa-solid fa-pen-to-square  w-20"></i>
                            <span>Đăng bài</span>
                        </label>
                    </button>

                    <button className={activeButton === 'postManager' ? 'button-click' : ''} onClick={() => handleNavigation(<ManagerPost/>,'postManager')}>
                        <label>
                            <i className="fa-solid fa-table-list w-20"></i>
                            <span>Quản lý bài đăng</span>
                        </label>
                    </button>

                    <button className={activeButton === 'userProfile' ? 'button-click' : ''} onClick={() => handleNavigation(<EditUser/>,'userProfile')}>
                        <label>
                            <i className="fa-solid fa-user-pen w-20"></i>
                            <span>Thông tin cá nhân</span>
                        </label>
                    </button>
                    

                    <button className={activeButton === 'changePass' ? 'button-click' : ''} onClick={() => handleNavigation(<ChangePass/>,'changePass')}>
                        <label>
                            <i className="fa-solid fa-lock w-20"></i>
                            <span>Đổi mật khẩu</span>
                        </label>
                    </button>

                    <button className={activeButton === 'historyMoney' ? 'button-click' : ''} onClick={() => handleNavigation(<HistoryPayment />,'historyMoney')}>
                        <label>
                            <i className="fa-solid fa-file-invoice-dollar w-20"></i>
                            <span>Lịch sử thanh toán</span>
                        </label>
                    </button>

                    <button onClick={exitClick}>
                        <label>
                            <i className="fa-solid fa-arrow-right-from-bracket w-20"></i>
                            <span>Thoát</span>
                        </label>
                    </button>
                </div>
                
            </div>
            <div style={{ flex: 1,backgroundColor: '#f4f6fd'}}>
                {currentContent}
            </div>
        </div>
    );
};

export default UserDashboard;
