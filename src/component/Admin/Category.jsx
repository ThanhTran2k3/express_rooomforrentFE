import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import { useUser } from '../../UserContext';
import { getCategory, showCategory } from '../../api/categoryApi';

const Category = () => {
    const { userInfo } = useUser();
    const [listCategory, setListCategory] = useState([])
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
            const result = await getCategory(pageNum,activeButton);
            setListCategory(result.content);
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

    const handleShow = async(catgoryId) =>{
        await showCategory(userInfo,catgoryId)
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
                            Loại bài đăng
                        </th>
    
                        <th className='w-25'></th>
                    </tr>
                </thead>
                <tbody>
                    {listCategory&&listCategory.length !== 0 &&(
                        listCategory.map((category) =>(
                            <tr className='bg-light' key={category._id}>
                                <td className="text-center pt-3" >
                                {category.categoryName}
                                </td>
                                <td  >
                                    <Link to={`/admin/manager/category/edit/${category.categoryName}`} className='btn btn-outline-dark button me-2'>
                                        Chỉnh sửa
                                    </Link>

                                    <button class="btn btn-outline-dark button" onClick={() => handleShow(category._id)}>
                                        <i className={`${!category.isDeleted?'fa-solid fa-eye-slash':'fa-solid fa-eye'} w-20`}></i>
                                        <span className='baseFont ps-1'>{!category.isDeleted?'Ẩn':'Hiện'}</span>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )} 
                </tbody>
            </table>
                {listCategory&&listCategory.length !== 0 &&(
                    <div className="d-flex justify-content-center mt-5">
                        <Pagination count={totalPage} page={page} onChange={handlePageChange}  variant="outlined" shape="rounded" />
                    </div>
                )}
        </div>
    );
};

export default Category;