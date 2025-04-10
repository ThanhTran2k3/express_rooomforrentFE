import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import { useUser } from '../../UserContext';
import { getRoomType, showRoomType } from '../../api/roomTypeApi';

const RoomType = () => {
    const { userInfo } = useUser();
    const [listRoomType, setListRoomType] = useState([])
    const [activeButton, setActiveButton] = useState(false);
    const [totalPage, setTotalPage] = useState()
    const [page, setPage] = useState(1);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pageUrl = queryParams.get('page');
    const pageNum = pageUrl ? Number(pageUrl) : 1; 
    const navigate = useNavigate()
    const [reload, setReload] = useState(false);

    useEffect(()=>{
        const fetchData = async () => {
            const result = await getRoomType(pageNum,activeButton);
            setListRoomType(result.content);
            setTotalPage(result.totalPage);
            setPage(result.currentPage);
        };
        fetchData();
    },[pageNum,activeButton,reload])



    const handleButtonClick = async(buttonName) => {
        setActiveButton(buttonName)
        navigate('');
    };

    const handlePageChange = async (event,value) => {
        navigate(`?page=${value}`);
        window.scrollTo(0, 0); 
    };

    const handleShow = async(serviceId) =>{
        await showRoomType(userInfo,serviceId)
        setReload(!reload)
    }

    return (
        <div className='manager-post'>
            <div className='btn-postpption'>
                <button className={`btn ${activeButton===false?'red-underline':''}`} onClick={() => handleButtonClick(false)}>
                    Đang hiện
                </button>
                <button className={`btn ${activeButton===true?'red-underline':''}`} onClick={() => handleButtonClick(true)}>
                    Đang ẩn
                </button>
                
            </div>

            <table class="table table-hover">
                <thead>
                    <tr>
                        <th class="text-center w-25" >
                            Loại phòng
                        </th>
    
                        <th className='w-25'></th>
                    </tr>
                </thead>
                <tbody>
                    {listRoomType&&listRoomType.length !== 0 &&(
                        listRoomType.map((roomType) =>(
                            <tr className='bg-light' key={roomType._id}>
                                <td className="text-center pt-3" >
                                {roomType.typeName}
                                </td>
                                <td  >
                                    <Link to={`/admin/manager/roomType/edit/${roomType.typeName}`} className='btn btn-outline-dark button me-2'>
                                        Chỉnh sửa
                                    </Link>

                                    <button class="btn btn-outline-dark button" onClick={() => handleShow(roomType._id)}>
                                        <i className={`${!roomType.isDeleted?'fa-solid fa-eye-slash':'fa-solid fa-eye'} w-20`}></i>
                                        <span className='baseFont ps-1'>{!roomType.isDeleted?'Ẩn':'Hiện'}</span>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )} 
                </tbody>
            </table>
                {listRoomType&&listRoomType.length !== 0 &&(
                    <div className="d-flex justify-content-center mt-5">
                        <Pagination count={totalPage} page={page} onChange={handlePageChange}  variant="outlined" shape="rounded" />
                    </div>
                )}
        </div>
    );
};

export default RoomType;