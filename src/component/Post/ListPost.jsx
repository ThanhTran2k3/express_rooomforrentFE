import React, { useEffect, useState } from 'react';
import { getNearPost, getPost } from '../../api/postApi';
import FormLocation from './FormLocation';
import { getRoomType } from "../../api/roomTypeApi";
import Post from './Post';
import Pagination from '@mui/material/Pagination';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';

const ListPost = () => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const [listPost, setListPost] = useState([])
    const [totalPage, setTotalPage] = useState()
    const [page, setPage] = useState(1);        
    const url = useLocation().pathname;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pageUrl = queryParams.get('page');
    const newPage = pageUrl ? Number(pageUrl) : 1; 
    const [listRoomType, setListRoomType] = useState([])
    const [selectedRoomType, setSelectedRoomType] = useState(null)
    const [selectedCity, setSelectedCity] = useState(location.state?location.state.city:null)
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedWard, setSelectedWard] = useState(null)
    const [selected, setSelected] = useState(null);
    const [center, setCenter] = useState(null);
    const [address, setAddress] = useState(location.state?location.state.address:'')
    const navigate = useNavigate();
    const containerStyle = {
        width: "100%",
        height: "100%",
    };

    useEffect(() => {
        const fetchData = async () => {
            let result
            if(url === '/new')
                result = await getPost(newPage,selectedCity,selectedDistrict,selectedWard,selectedRoomType);
            else{
                if(address){
                    result = await getNearPost(address,newPage,selectedCity,selectedDistrict,selectedWard,selectedRoomType)
                }
                else{
                    navigate('/')
                    return
                }
                    
            }

            setPage(result.currentPage)
            setListPost(result.content);
            setTotalPage(result.totalPage)

            
           
            
        };
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' 
          });
        fetchData();
    }, [newPage,selectedCity,selectedDistrict,selectedWard,selectedRoomType,url,address,navigate]); 

    useEffect(() => {
        const fetchData = async () => {
            const roomTypes = await getRoomType(1,false);

            setListRoomType(roomTypes.content);
        };
        fetchData();
    }, []); 

    useEffect(() => {
        if(listPost.length !== 0){
            setCenter({ lat: listPost[0].latitude, lng: listPost[0].longitude });
        }
    }, [listPost]); 

    const handleRoomTypeChange = (event) => {
        const selectedRoomTypeName = event.target.value==='0'?null:event.target.options[event.target.selectedIndex].text;
        setSelectedRoomType(selectedRoomTypeName); 
    };

    const handlePageChange = async (event,value) => {
        navigate(`?page=${value}`);
    };

    const handleMarkerClick = (location) => {
        setSelected(location);
        setCenter({ lat: location.latitude, lng: location.longitude });
      };
      const handleClick = (url) => {
        window.open(url, "_blank");
    };
    return (
        <div className="container">
            <div className='d-flex'>
                <div className="list-container pb-5">
                    <div className="option-container">
                        <FormLocation 
                            setSelectedCity = {setSelectedCity}
                            setSelectedDistrict = {setSelectedDistrict}
                            setSelectedWard = {setSelectedWard}
                        />
                        <div className="form-floating mb-4">
                            <select className="form-control form-select" onChange={handleRoomTypeChange}>
                                <option selected disabled hidden>Chọn loại phòng</option>
                                <option value="0">Tất cả</option>
                                {Array.isArray(listRoomType)&&(
                                    listRoomType.map(roomType => (
                                        <option value={roomType._id} key={roomType._id}>{roomType.typeName}</option>
                                )))}
                            </select>
                            <label className="control-label">Loại phòng</label>
                        </div>
                    
                    </div>
              
                    {listPost&& listPost.length !==0 ? (
                        listPost.map((item)  => (
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

                        ))
                    ) : (
                        <div className="error-container w-100">
                            <p>Không có bài đăng nào</p>
                        </div>
                    )}
                    {listPost.length!==0&&(
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination count={totalPage} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
                        </div>
                    )}
                
                </div>
                <div className='map-container'>
                {console.log(center)}
                    <LoadScript googleMapsApiKey={apiKey}>
                            <GoogleMap mapContainerStyle={containerStyle} options={{gestureHandling: "greedy", }}  center={center} zoom={10}>
                            {listPost.map((post) => (
                                <Marker
                                    key={post.postId}
                                    position={{ lat: post.latitude, lng: post.longitude }}
                                    onClick={() => handleMarkerClick(post)}
                                />
                            ))}
                            {selected && (
                            <InfoWindow
                                position={{ lat: selected.latitude, lng: selected.longitude }}
                                onCloseClick={() => setSelected(null)}
                                >
                               <div className="info-window-content d-flex">
                              
                                    <img src={`${selected.imageProducts[0].urlImage}`} alt="Hình ảnh bài đăng"/>
                                    <div>
                                            {/* <Link to={`/post/${selected.postId}`}> */}
                                                <h3 onClick={() => handleClick(`/post/${selected._id}`)} className='mb-2'>{selected.title}</h3>
                                            {/* </Link> */}
                                            
                                            <span className="card-area lead mb-2">
                                                {selected.area} m<sup>2</sup>
                                            </span>
                                            <p className="card-price lead mb-2">
                                                {selected.rentPrice.toLocaleString()} đ/ tháng
                                            </p>
                                    </div>
                                </div>
                            </InfoWindow>
                            )}
                            </GoogleMap>
                        
                    </LoadScript>
                </div>
               
            </div>
            
            

           
        </div>
    );
};

export default ListPost;
