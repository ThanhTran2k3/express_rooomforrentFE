import React, { useEffect, useState } from 'react';
import Post from './Post';
import { Pagination } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { getPostManager, getPostUser } from '../../api/postApi';


const PostList = (props) => {
    const [listPost, setListPost] = useState([])
    const [totalPage, setTotalPage] = useState()
    const { userInfo } = useUser();
    const { userName } = useParams()
    const currentUserName = userName || userInfo.userName;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pageUrl = queryParams.get('page');
    const newPage = pageUrl ? Number(pageUrl) : 1; 
    const navigate = useNavigate();
    const [reload, setReload] = useState(false)

    useEffect(()=>{
        
        const fetchData = async () => {
            let post;
            if(userInfo.role === 'Admin')
                post = await getPostManager(userInfo,navigate,newPage,props.postType)
            else
                post = await getPostUser(currentUserName,navigate,newPage,props.postType);
            console.log(post)
            setListPost(post.content)
            setTotalPage(post.totalPage)
        };

        fetchData();
        
        window.scrollTo(0, 0); 
    },[currentUserName,navigate,newPage,props.postType,userInfo,reload])

   

    const handlePageChange = async (event,value) => {
        navigate(`?page=${value}`);
        window.scrollTo(0, 0); 
        
        
    };

    return (

            <div className='m-5'>
                {listPost.length !== 0 ? (
                    <>
                        {listPost.map((item)  => (
                            <Post  
                                    key={item._id}
                                    postId={item._id}
                                    filteredAnh={item.imageProducts}
                                    postCategory={item.postCategory}
                                    title = {item.title}
                                    area ={item.area}
                                    rentPrice = {item.rentPrice}
                                    city = {item.city}
                                    district = {item.district}
                                    expirationDate= {item.expirationDate}
                                    approvalStatus={item.approvalStatus}
                                    userName ={item.user.userName}
                                    isDeleted = {item.isDeleted}
                                    reload = {reload}
                                    setReload ={setReload}
                            />
                        ))}
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination count={totalPage} page={newPage}  onChange={handlePageChange} variant="outlined" shape="rounded"/>
                        </div>
                    </>
                ) : (
                    <div className="no-posts">
                        <p>Không có bài viết để hiển thị.</p>
                    </div>
                )}
                
            </div>

    );
};

export default PostList;