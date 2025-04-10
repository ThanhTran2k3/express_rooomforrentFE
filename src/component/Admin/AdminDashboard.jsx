import { useEffect, useState } from "react";
import UserManager from "./UserManager";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";
import EditUser from "../User/EditUser";
import ChangePass from "../User/ChangePass";
import ApprovePost from "./ApprovePost";
import Statistical from "./Statistical";
import Service from "./Service";
import CreateService from "./CreateService";
import EditService from "./EditService";
import { me } from "../../api/authApi";
import CreateRoomType from "./CreateRoomType";
import RoomType from "./RoomType";
import EditRoomType from "./EditRoomType";
import Category from "./Category";
import CreateCategory from "./CreateCategory";
import EditCategory from "./EditCategory";



const AdminDashboard = () => {
    const [currentContent, setCurrentContent] = useState(<UserManager />);
    const navigate = useNavigate();
    const [user,setUser] = useState({})
    const [activeButton, setActiveButton] = useState('userManage');
    const { userInfo } = useUser();
    const location = useLocation(); 

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);


    useEffect(() => {
        const fetchData = async () => {

                const user = await me(userInfo,navigate);
                setUser(user);
           
        };
    
        if (userInfo) {  
            fetchData();
        }
    }, [userInfo,navigate]);



    useEffect(() => {

        if (location.pathname === '/admin/manager/user') {
            setCurrentContent(<UserManager />);
            setActiveButton('userManager')
        } else if (location.pathname === '/admin/manager/post') {
            setCurrentContent(<ApprovePost />);
            setActiveButton('postManager')
        } else if (location.pathname === '/admin/manager/edit/profile') {
            setCurrentContent(<EditUser />);
            setActiveButton('userProfile')
        } else if (location.pathname === '/admin/manager/chart') {
            setCurrentContent(<Statistical />);
            setActiveButton('statistical')
        }else if (location.pathname === '/admin/manager/service') {
            setCurrentContent(<Service />);
            setActiveButton('service')
        }else if (location.pathname === '/admin/manager/service/add') {
            setCurrentContent(<CreateService />);
            setActiveButton('addService')
        }
        else if (location.pathname === '/admin/manager/roomType') {
            setCurrentContent(<RoomType />);
            setActiveButton('roomType')
        }
        else if (location.pathname === '/admin/manager/roomType/add') {
            setCurrentContent(<CreateRoomType />);
            setActiveButton('addRoomType')
        } else if (location.pathname === '/admin/manager/category') {
            setCurrentContent(<Category />);
            setActiveButton('category')
        }
        else if (location.pathname === '/admin/manager/category/add') {
            setCurrentContent(<CreateCategory />);
            setActiveButton('addCategory')
        }
        else if (location.pathname.includes('/admin/manager/service/edit/')) {
            setCurrentContent(<EditService />);
        }else if (location.pathname.includes('/admin/manager/roomType/edit/')) {
            setCurrentContent(<EditRoomType />);
        }else if (location.pathname.includes('/admin/manager/category/edit/')) {
            setCurrentContent(<EditCategory />);
        }else{
            setCurrentContent(<ChangePass />);
            setActiveButton('changePass')
        }
            
        
    }, [location.pathname, user]);



    const handleNavigation = (content,buttonName) => {
         setCurrentContent(content);
         setActiveButton(buttonName);
        
        if(buttonName==='userManager')
            navigate('/admin/manager/user')
        else if(buttonName==='postManager')
            navigate('/admin/manager/post')
        else if(buttonName==='userProfile')
            navigate('/admin/manager/edit/profile')
        else if(buttonName==='historyMoney')
            navigate('/admin/manager/payment/history')
        else if(buttonName==='statistical')
            navigate('/admin/manager/chart')
        else if(buttonName==='service')
            navigate('/admin/manager/service')
        else if(buttonName==='addService')
            navigate('/admin/manager/service/add')
        else if(buttonName==='roomType')
            navigate('/admin/manager/roomType')
        else if(buttonName==='addRoomType')
            navigate('/admin/manager/roomType/add')
        else if(buttonName==='category')
            navigate('/admin/manager/category')
        else if(buttonName==='addCategory')
            navigate('/admin/manager/category/add')
        else
            navigate('/admin/manager/change/password')

     };

    const exitClick = () => {
        navigate('/')
    };

    // const formatCurrency = (amount) => {
    //     if (amount === undefined || amount === null || !userInfo.roles.includes('ROLE_USER')) {
    //         return 'N/A';
    //     }
    //     return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ';
    // }

   

    return (
        <div className='d-flex w-100'>
             <div className='user-dashboard'>
                <div className="user-info d-flex">
                        <div className="avatar-user">
                            <img src={`${user.avatar}`} alt="" className="avatar" />
                        </div>
                        <div className='user-details'>
                            {/* <button className='userName-click' onClick={() => handleNavigation(<UserInfo />,'userInfo')}> */}
                                <label className='userName-click'>{user.userName}</label>
                            {/* </button> */}
                        </div>
                    
                </div>
                <div className='dashboard'>
            
                    <button className={activeButton === 'userManager' ? 'button-click' : ''} onClick={() => handleNavigation(<UserManager/>,'userManager')}>
                        <label>
                            <i className="fa-solid fa-user w-20"></i>
                            <span>Quản lý người dùng</span>
                        </label>
                    </button>
                    <button className={activeButton === 'postManager' ? 'button-click' : ''} onClick={() => handleNavigation(<ApprovePost/>,'postManager')}>
                        <label>
                            <i className="fa-solid fa-table-list w-20"></i>
                            <span>Quản lý bài đăng</span>
                        </label>
                    </button>

                    <button className={activeButton === 'addService' ? 'button-click' : ''} onClick={() => handleNavigation(<CreateService />,'addService')}>
                        <label>
                            <i class="fa-regular fa-square-plus w-20"></i>
                            <span>Thêm dịch vụ</span>
                        </label>
                    </button>
                    <button className={activeButton === 'service' ? 'button-click' : ''} onClick={() => handleNavigation(<Service />,'service')}>
                        <label>
                            <i class="fa-solid fa-scroll w-20"></i>
                            <span>Dịch vụ</span>
                        </label>
                    </button>
                    <button className={activeButton === 'addRoomType' ? 'button-click' : ''} onClick={() => handleNavigation(<CreateRoomType />,'addRoomType')}>
                        <label>
                            <i class="fa-regular fa-square-plus w-20"></i>
                            <span>Thêm loại phòng</span>
                        </label>
                    </button>
                    <button className={activeButton === 'roomType' ? 'button-click' : ''} onClick={() => handleNavigation(<RoomType />,'roomType')}>
                        <label>
                            <i class="fa-solid fa-hospital w-20"></i>
                            <span>Loại phòng</span>
                        </label>
                    </button>
                    <button className={activeButton === 'addCategory' ? 'button-click' : ''} onClick={() => handleNavigation(<CreateCategory />,'addCategory')}>
                        <label>
                            <i class="fa-regular fa-square-plus w-20"></i>
                            <span>Thêm loại bài đăng</span>
                        </label>
                    </button>
                    <button className={activeButton === 'category' ? 'button-click' : ''} onClick={() => handleNavigation(<Category />,'category')}>
                        <label>
                            <i class="fa-solid fa-table-list w-20"></i>
                            <span>Loại bài đăng</span>
                        </label>
                    </button>
                    <button className={activeButton === 'changePass' ? 'button-click' : ''} onClick={() => handleNavigation(<ChangePass />,'changePass')}>
                        <label>
                            <i className="fa-solid fa-lock w-20"></i>
                            <span>Đổi mật khẩu</span>
                        </label>
                    </button>

        
                    <button className={activeButton === 'statistical' ? 'button-click' : ''} onClick={() => handleNavigation(<Statistical />,'statistical')}>
                        <label>
                            <i className="fa-solid fa-chart-line w-20"></i>
                            <span>Thống kê</span>
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

export default AdminDashboard;