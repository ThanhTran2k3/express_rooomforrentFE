import React, { useEffect, useState } from 'react';
import { useUser } from '../../UserContext';
import PostList from './PostList';
import Post from './Post';
import { Pagination } from '@mui/material';
import { getLike } from '../../api/postApi';

const FavoritePost = () => {

    const { userInfo  } = useUser();
    const [listPost, setListPost] = useState([])

    useEffect(()=>{
        const fetchData = async () => {
            const result = await getLike(userInfo)
            setListPost(result.likePost)
        };
        fetchData();
    },[userInfo])

    return (

        <div className='m-5 p-5'>
            {listPost.length !== 0 ? (
                <>
                    {listPost.map((item)  => (
                        <Post  
                                key={item._id}
                                postId={item._id}
                                filteredAnh={item.imageProducts}
                                postCategory={item.postCategory}
                                title={item.title}
                                area={item.area}
                                rentPrice={item.rentPrice}
                                district = {item.district}
                                city={item.city}
                                userName={item.user.userName}
                        />
                    ))}
                    {/* <div className="d-flex justify-content-center mt-5">
                            <Pagination count={totalPage} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
                    </div> */}
                </>
            ) : (
                <div className="no-posts">
                    <p>Không có bài viết để hiển thị.</p>
                </div>
            )}
            
        </div>

    );
};

export default FavoritePost;