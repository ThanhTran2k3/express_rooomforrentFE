import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, getPostDetail, servicePost } from "../../api/postApi";
import { useUser } from '../../UserContext';
import Post from './Post';
import { getServicess } from '../../api/serviceApi';
import Swal from 'sweetalert2';

const PostService = (props) => {
    const [post ,setPost] = useState()
    const { userInfo } = useUser();
    const { postId } = useParams()
    const [listService , setListService] = useState([])
    const [totalAmount, setTotalAmount] = useState()
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const [serviceSel, setServiceSel] = useState({})

    useEffect(()=>{
        if(postId){
            const fetchData = async () => {
                const post = await getPostDetail(postId,navigate);
                const service = await getServicess()
                setListService(service)
                setPost(post)
            };
            fetchData();
        }
       
    },[postId,userInfo,navigate])


    const changeMonth = (event) =>{
        
        const month =event.target.value
        const sanitizedValue = month.replace(/[^0-9-]/g, '');
        setValue(sanitizedValue);
        const total = sanitizedValue*serviceSel.price
        setTotalAmount(total)
    }

    const pay = async ()=>{
        
        try {
            await servicePost(userInfo, post._id, value, serviceSel._id,navigate);
            
        } catch (error) {

            console.error("Error:", error);

        }
    }

    const handleChange = (event) => {
        setValue(1)
        const service = listService.find(item=>item._id.toString() === event.target.value)
        setServiceSel(service)
        setTotalAmount(service.price)
    };

    return (
        <div className="row">
            <div className="col-md-12">
            {post && (
                <div className='w-75 mx-auto mt-4'>
                        <Post  
                            key={post._id}
                                postId={post._id}
                                filteredAnh={post.imageProducts}
                                postCategory={post.postCategory}
                                title={post.title}
                                area={post.area}
                                rentPrice={post.rentPrice}
                                city={post.city}
                                district= {post.district}
                                userName={post.user.userName}
                        />
                        </div>
                    )}
                {listService.length>0 ? (
                    <div className="form-03-main w-40 mx-auto p-5">
                    
                        <div className="mb-4 d-flex gap-4">
                            {listService.map(item =>(
                                <div key={item.serviceId} className="d-flex align-items-center justify-content-center radio-wrapper w-50">
                                    <input type="radio"  id={item._id} onChange={handleChange} name='payment' className="radio-input"  value={item._id}/>
                                    <label htmlFor={item.serviceName}  className='ms-2 radio-label'>
                                        <i className={`fa-solid ${item.serviceName==='Tin ưu tiên'?'fa-up-long':'fa-up-right-and-down-left-from-center'}`}></i> {item.serviceName}
                                    </label>
                                </div>
                            ))}
                           
                            
                        </div>

                        
                        <div className="form-floating mb-4" >
                            <input onChange={changeMonth} disabled={value===0} value={value}  type='number' className="form-control" step="1" min={1} placeholder='Số ngày' />
                            <label className="control-label">Số ngày</label>
                        </div>

                        <div className="form-floating mb-4 d-flex">
                            <input value={totalAmount}  type="number" className="form-control" disabled />
                            <label className="control-label">Tổng tiền</label>
                            <span className="input-group-text">đ</span>
                        </div>
                        <span className="text-danger"></span>

                        

                        <button  className="button-info payment" onClick={pay}>
                            <label>Thanh toán</label>
                        </button>
                    </div>
                ):(
                    <div className="no-posts">
                        <p>Không có dịch vụ</p>
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default PostService;