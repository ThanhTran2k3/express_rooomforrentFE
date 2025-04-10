import React, { createRef, useEffect, useState } from 'react';
import { useUser } from '../../UserContext';
import { addReviews, edirReview, getReviews, showReviews } from '../../api/reviewsApi';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Pagination } from '@mui/material';

const Reviews = (props) => {
    const { userInfo } = useUser();
    const [reviews, setReviews] = useState([]);
    const [reload, setReload] = useState(false);
    const reviewsref = createRef();
    const navigate = useNavigate();
    const [totalPage, setTotalPage] = useState()
    const [page, setPage] = useState(1);
    const [review, setReview] = useState()
    useEffect(()=>{
        
        const fetchData = async () => {
            const result = await getReviews(props.user._id,page)
            setReviews(result.content)
            setTotalPage(result.totalPage);
            setPage(result.currentPage);
        };
        fetchData();

    },[props.user._id,reload,page])

    const handleSendReviews = async (event) => {
        event.preventDefault()
        const reviews = reviewsref.current.value.trim();
        if (!reviews) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập đầy đủ thông tin!",
            });
            return;
        }

        const data = { 
            content: reviews,
        };
        if(!review)
            await addReviews(userInfo,data,props.user._id,navigate)
        else
            await edirReview(userInfo,data,review,navigate)
        setReload(!reload)
    };

    const handlePageChange = async (event,value) => {
        setPage(value)
        window.scrollTo(0, 0);
    };

    const handleShow = async(reviewsId) =>{
        await showReviews(userInfo,reviewsId)
        setReload(!reload)
    }

    const handleEdit = async(reviewId, content) =>{
        reviewsref.current.value = content;
        setReview(reviewId)
    }

    return (
        <div className='m-5'>
            {userInfo&&userInfo.userName!==props.user.userName&&userInfo.role === 'User' &&(
                <div className="input-container ms-5 me-5 mt-2">
                    <img src={`${userInfo.avatar}`} alt="" className="avatar me-2" />
                    <input
                        type="text"
                        className="message-input"
                        placeholder="Nhập nội dung"
                        ref={reviewsref}
                    />
                    <button className="send-button" onClick={handleSendReviews}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
            </div>
            )}
             
            {reviews.length !==0 ?(
                <>
                    <div className="comments-list mt-3">
                        {reviews.map((review) => (
                            <div key={review.reviewsId} className="comment-item">
                                <div>
                                    <img src={`${review.user.avatar}`} alt="" className="avatar me-2" />
                                    <label>{review.user.userName}</label>
                                </div>
                                <p>{review.content}</p>
                                <div>
                                    <span>{moment(review.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                                    {userInfo&&userInfo.userName===review.user.userName&&(
                                        <div className="d-flex gap-2 justify-content-end mt-2">
                                            <span className='btn-action text-primary' onClick={() => handleEdit(review._id, review.content)}>Sửa</span>
                                            <span className='btn-action text-danger' onClick={() => handleShow(review._id)}>Gỡ</span>
                                        </div>
                                        
                                    )}
                                    
                                </div>
                                
                            </div>
                        ))}
                    </div>
                    <div className="d-flex justify-content-center mt-5">
                        <Pagination count={totalPage} page={page} onChange={handlePageChange}  variant="outlined" shape="rounded" />
                    </div>
                </>
              

           
                
            ) : (
                <div className="no-posts">
                    <p>Không có đánh giá để hiển thị.</p>
                </div>
            )}
           
        </div>
    );
};

export default Reviews;