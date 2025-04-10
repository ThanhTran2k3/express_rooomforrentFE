import React, { useEffect, useState } from 'react';
import './HeaderWeb.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../UserContext';
import { postSuggestions } from '../../api/postApi';

const HeaderWeb = () => {

    const [clicked, setClicked] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo, logout  } = useUser();
    const [suggestions, setSuggestions] = useState([]);
    const [query, setQuery] = useState('');
    const [micQuery, setMicQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(""); 


    useEffect(() => {
        const timer = setTimeout(() => {
          setDebouncedQuery(query); 
        }, 500);
    
        return () => clearTimeout(timer); 
      }, [query]);
    
      useEffect(() => {
        if (debouncedQuery) {
            const fetchData = async () => {
                const suggestion = await postSuggestions(debouncedQuery)
                setSuggestions(suggestion)
            };
            fetchData()
        }
      }, [debouncedQuery]);

    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
    };

    const handleChange = async (e) => {
        const query = e.target.value;
        setQuery(query)
    };

    const handleInpuclick = async (e) => {
        if(!clicked){
            const suggestion = await postSuggestions(query)
            setSuggestions(suggestion)
            setClicked(true)
        }
        
    };


    const handleSuggestionClick = async (item) => {
        setQuery(item)
    };



    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?query=${query}`)
    };

    const handleReload = () => {
        navigate(0);
    }; 

    const handleLogout = () => {
        Swal.fire({
          title: "Bạn chắc chắn?",
          text: "Bạn sẽ đăng xuất khỏi tài khoản của mình.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Đăng xuất",
          cancelButtonText: "Thoát"
        }).then((result) => {
          if (result.isConfirmed) {
            logout()
            navigate('/');
            Swal.fire({
              title: "Đăng xuất!",
              text: "Bạn đã đăng xuất thành công.",
              icon: "success"
            });
          }
        });
    }



    useEffect(() => {
        if(micQuery){
            navigate(`/search?query=${micQuery}`)
            setMicQuery('')
        }
            
    }, [micQuery,navigate]);



    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-black border-bottom box-shadow">
                <div className="container-fluid ">
                    {location.pathname ==='/' ?(
                        <img src='/Logo.jpg' onClick={handleReload} alt='logo' className='logo-img'></img>
                    ):(
                        <Link className="navbar-brand" to="/">
                            <img src='/Logo.jpg' alt='logo' className='logo-img'></img>
                        </Link>
                    )}
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1">
                            <div className="search-bar position-absolute w-100 d-flex justify-content-center">
                                <form id="search-form" className="dropdown">
                                    <div className="input-group">
                                        <input onChange={handleChange} onClick={handleInpuclick} className="form-control search-input" value={query?query:''} type="text" name="query" autoComplete="off" placeholder="Tìm bài đăng" required />
                                        <div id="search-results" className="dropdown-content search-results">
                                            {Array.isArray(suggestions) && suggestions.length > 0 ? (
                                                suggestions.map((item, index) => (
                                                    <div onClick={() => handleSuggestionClick(item)} key={index} className='suggestion'>{item}</div>
                                                ))
                                            ) : (
                                                <div className='suggestion'>Không có kết quả</div>
                                            )}
                                        </div>
                                        <button className="btn btn-outline-dark bg-white btn-search" onClick={handleSearch}>
                                            <i className="me-1">Tìm kiếm</i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </ul>


                    </div>
                    {userInfo ?(
                        <div className="user-info">
                            <h6>{userInfo.userName}</h6>
                            <div className="profile-menu">
                                <img 
                                    src={userInfo.avatar} 
                                    alt='Avatar'
                                    onClick={handleMenuToggle} 
                                    className="avatar-img"
                            />
                            {showMenu && (
                                <div className="menu">
                                    <ul>
                                    {userInfo &&
                                        <li>
                                            <Link to={`${userInfo.role === "User"?'user/manager':'admin/manager/user'}`}>
                                                <label>
                                                    <i className="fa-solid fa-user w-20"></i>
                                                    <span>Tài khoản</span>
                                                </label>
                                            </Link>
                                        </li>
                                    }
                                        {userInfo.role !== "Employee"&&userInfo.role !== "Admin" &&(
                                            <li>
                                                <Link to={`user/favorite/post`}>
                                                    <label>
                                                        <i className="fa-solid fa-heart w-20"></i>
                                                        <span>Yêu thích</span>
                                                    </label>
                                                </Link>
                                            </li>
                                        )}
                                        

                                        <li>
                                            <button onClick={handleLogout} className="logout-button">
                                                <label>
                                                        <i className="fa-solid fa-right-from-bracket w-20"></i>
                                                        <span>Đăng xuất</span>
                                                </label>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                            </div>
                        </div>
                    ) : (
                        <Link to={'/login'} className="btn btn-black-white btn-block">
                            Login
                        </Link>
                    )}
                </div>
            </nav>
            
        </header>
    );
};

export default HeaderWeb;


