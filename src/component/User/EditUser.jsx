import React, { useEffect, useState } from 'react';
import FormLocation from '../Post/FormLocation';
import { Link, useNavigate } from 'react-router-dom';
import { editUser } from '../../api/userApi';
import Swal from 'sweetalert2';
import { useUser } from '../../UserContext';
import { me } from '../../api/authApi';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getCoordinates } from '../../api/mapApi';

const EditUser = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const { userInfo, updateUser} = useUser();
    // const [showPassword, setShowPassword] = useState(false);
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // const [error, setError] = useState('');
    const navigate = useNavigate();
    const [user,setUser] = useState({})
    const [center, setCenter] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null)
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedWard, setSelectedWard] = useState(null)
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const [debouncedQuery, setDebouncedQuery] = useState(""); 
    const containerStyle = {
        width: "100%",
        height: "100%",
    };
    useEffect(() => {
            if(!user.city && !user.district && !user.ward){
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                      setCenter({
                          lat: position.coords.latitude,
                          lng: position.coords.longitude,
                          });
                      },
                      
                    );
                  } 
            }
        }, [user]);
    useEffect(()=>{
        if (!userInfo) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            const user = await me(userInfo,navigate)
            setUser(user)
        };
        fetchData();
    },[userInfo,navigate])


    useEffect(()=>{
        if (user.city && user.district && user.ward) {
            setSelectedCity(user.city)
            setSelectedDistrict(user.distric)
            setSelectedWard( user.ward)
        }
    },[user])

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // const togglePassword = (input, value) => {
    //     input(!value);
    // };

    // const comfigPass = (event)=>{
    //     const password = event.target.form.password.value;
    //     const confirmPassword = event.target.value;
    //     if (password !== confirmPassword) {
    //         setError('Mật khẩu không khớp!');
    //     } else {
    //         setError('');
    //     }
    // }

    const handleSubmit = async (event) => {

        event.preventDefault()
        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
          }).then((result) => {
            if (result.isConfirmed) {
                const formData = new FormData()
                formData.append('userName', event.target.userName.value);
                formData.append('phoneNumber', event.target.phoneNumber.value);
                if(event.target.city.selectedOptions[0].text!=="Chọn tỉnh thành")
                    formData.append('city', event.target.city.selectedOptions[0].text);
                if(event.target.district.selectedOptions[0].text!=="Chọn quận huyện")
                    formData.append('district', event.target.district.selectedOptions[0].text);
                if(event.target.wards.selectedOptions[0].value!=="Chọn phường xã")
                formData.append('ward', event.target.wards.selectedOptions[0].text);
                formData.append('address', event.target.address.value);
                formData.append('email', event.target.email.value);


                const fileInput = event.target.image.files[0];
                if (fileInput) {
                    formData.append('avatar', fileInput);
                }

              editUser(formData,userInfo,updateUser)
            } else if (result.isDenied) {
              Swal.fire("Changes are not saved", "", "info");
            }
        });
        
    }

    useEffect(() => {
            const fetchCoordinates = async () => {
                const address = debouncedQuery +', '+selectedWard+', '+selectedDistrict+', '+selectedCity
                console.log(address)
                const coords = await getCoordinates(address);
                if (coords) {
                    setCenter(coords);
                }
            };
            if(selectedCity)
                fetchCoordinates();
        }, [debouncedQuery,selectedWard,selectedDistrict,selectedCity]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
        console.log(selectedCity,selectedDistrict,selectedWard)
      };

       useEffect(() => {
              const timer = setTimeout(() => {
                setDebouncedQuery(user.address); 
              }, 500);
          
              return () => clearTimeout(timer); 
            }, [user.address]);
    return (
        <div>
            <div className="row">
                <div className="col-md-12 ">
                        <form onSubmit={handleSubmit}>
                            <div className="form-03-main w-100">
                                <div className="text-danger"></div>
                                <div className="image-upload-container">
                                    <input type="file" id="imageUpload" className="file-input" name='image' accept="image/*" onChange={handleImageChange} />
                                    <img id="imagePreview" src={imagePreview||`${user.avatar}`} alt=''/>
                                    <label htmlFor="imageUpload" className="upload-label">
                                        <div className="upload-text">Chọn avatar</div>
                                    </label>
                                </div>

                                <div >
                                    <div className="w-100 mr-50">
                                        <div className="form-floating mb-4">
                                            <input value={user.userName || ''} className="form-control" onChange={handleInputChange} name="userName" placeholder="Tên đăng nhập" required />
                                            <label  className="control-label">Tên đăng nhập</label>
                                            <span className="text-danger"></span>
                                        </div>

                    

                                        <div className="form-floating mb-4">
                                            <input value={user.phoneNumber || ''} className="form-control" onChange={handleInputChange} name="phoneNumber" placeholder="Số điện thoại" required />
                                            <label className="control-label">Số điện thoại</label>
                                            
                                        </div>

                                        <div className="form-floating mb-4">
                                            <input value={user.email||''} className="form-control" onChange={handleInputChange} name="email" placeholder="Email" required></input>
                                            <label className="control-label">Email</label>
                                        </div>




                                    </div>

                                    <div className="d-flex">
                                        <div className='w-50'>
                                            <FormLocation 
                                                city = {user.city||''}
                                                district = {user.district||''}
                                                ward = {user.ward||''}
                                                setSelectedCity = {setSelectedCity}
                                                setSelectedDistrict = {setSelectedDistrict}
                                                setSelectedWard = {setSelectedWard}
                                            />
                                            <div className="form-floating mb-4">
                                                <input value={user.address || ''} onChange={handleInputChange} className="form-control" name="address" required />
                                                <label className="control-label">Địa chỉ</label>
                                                <span className="text-danger"></span>
                                            </div>
                                        </div>
                                        <div className='w-50 mb-4 ms-3'>
                                            <LoadScript googleMapsApiKey={apiKey}>
                                                {center && (
                                                    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
                                                        <Marker position={center} />
                                                    </GoogleMap>
                                                )}
                                            </LoadScript>
                                        </div>
                                    </div>
                                </div>

                               
                               {/* <div className="form-floating mb-4">
                                    <input type={showPassword ? 'text' : 'password'}  className="for m-control" name="password" placeholder="Password"  required></input>
                                    <label className="control-label">Password</label>
                                    <span onClick={()=>togglePassword(setShowPassword,showPassword)} className="position-absolute end-0 top-50 translate-middle-y show_icon">
                                        <i id="eyeIcon" className={`fa-solid ${showPassword?'fa-eye-slash':'fa-eye'}`}></i>
                                    </span>
                                </div>
                                <div className="form-floating mb-4">
                                    <input type={showConfirmPassword ? 'text' : 'password'} className="form-control" placeholder="Confirm password" required onChange={comfigPass}></input>
                                    <label className="control-label">Confirm password</label>
                                    <span onClick={()=>togglePassword(setShowConfirmPassword,showConfirmPassword)} className="position-absolute end-0 top-50 translate-middle-y show_icon">
                                        <i id="eyeIcon" className={`fa-solid ${showConfirmPassword?'fa-eye-slash':'fa-eye'}`}></i>
                                    </span>
                                </div>
                                {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>} */}
                               
                                
                               


                                <div className="mb-4">
                                    <div className="_btn_04">
                                        <button type="submit" className="btn createButton">Lưu</button>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <Link to={'/'}>Trở về</Link>
                                </div>
                            </div>

                        </form>
                </div>
            </div>
        </div>
    );
};

export default EditUser;