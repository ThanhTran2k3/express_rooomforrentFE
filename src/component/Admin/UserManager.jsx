import React, { useEffect, useState } from 'react';
import { blockUser, getRoleEmployee, getRoleUser } from '../../api/userApi';
import { useUser } from '../../UserContext';
import moment from 'moment';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';

const UserManager = () => {

    const [listUser, setListUser] = useState([]);
    const { userInfo } = useUser();
    const [activeButton, setActiveButton] = useState(false);
    const [totalPage, setTotalPage] = useState()
    const [page, setPage] = useState(1);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pageUrl = queryParams.get('page');
    const newPage = pageUrl ? Number(pageUrl) : 1; 
    const navigate = useNavigate()
    const [reload, setReload] = useState(false)


    useEffect(()=>{
        const fetchdata = async ()=>{
            let result = await getRoleUser(userInfo,activeButton,newPage)
            setListUser(result.content)
            setTotalPage(result.totalPage);
            setPage(result.currentPage);
            console.log(result.content)
        }
        fetchdata()
        
    },[userInfo,activeButton,newPage,reload,location.pathname])
    const handleButtonClick = async(buttonName) => {
        setActiveButton(buttonName)
        navigate('');
    };

    const handlePageChange = async (event,value) => {
        navigate(`?page=${value}`);
        window.scrollTo(0, 0); 
    };

    const block = async(userId) =>{
        await blockUser(userInfo,userId)
        setReload(!reload)
        
    }

    return (
        <div className='manager-post'>
            <div className='btn-postpption'>
                <button className={`btn ${activeButton===false?'red-underline':''}`} onClick={() => handleButtonClick(false)}>
                    Đang hoạt động
                </button>
                <button className={`btn ${activeButton===true?'red-underline':''}`} onClick={() => handleButtonClick(true)}>
                    Đang khóa
                </button>
                
            </div>
            <div className="invoice-list">
                {listUser.length !== 0 ? (
                    <>
                        <div className='d-flex'>
                            {listUser.map((user) => (
                                <div key={user.userId} className="w-33 border me-5">
                                    <div className="info h-100">
                                        <Link to={`/user/${user.userName}`} >
                                            <div className="avatar-user">
                                                    <img src={`${user.avatar}`} alt="" className="avatar" />
                                                </div>
                                                <h4 className="p-5px text-center">{user.userName}</h4>
                                        </Link>
                                        
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
                                            <span>Ngày tham gia: {moment(user.joinDate).format('DD-MM-YYYY')}</span>
                                        </label>
                                        <button onClick={()=>block(user._id)} className={`button-info mt-3 ${!user.isDeleted?'report':'phone-number'}`}>
                                            <label>
                                                <i className="fa-solid fa-circle-info w-20"></i>
                                                <span>{`${!user.isDeleted?'Khóa tài khoản':'Mở khóa'}`}</span>
                                            </label>
                                        </button>
                                    </div>
                                            
                        

                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination count={totalPage} page={newPage} onChange={handlePageChange}  variant="outlined" shape="rounded" />
                        </div>
                    </>
                ) : (
                    <div className="no-invoices">
                        <p>Không có người dùng</p>
                    </div>
                )}
               
            </div>
            
            </div>
    );
};

export default UserManager;