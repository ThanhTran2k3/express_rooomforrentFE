
import './App.css';
import HeaderWeb from './component/headerWeb/HeaderWeb.jsx';
import FooterWeb from './component/footerWeb/FooterWeb.jsx';
import ListPost from './component/Post/ListPost.jsx';
import DetailsPost from './component/Post/DetailsPost.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './component/Auth/Register.jsx';
import Login from './component/Auth/Login.jsx';
import Error from './component/error/Error.jsx';
import UserDashboard from './component/User/UserDashboard.jsx';
import { UserProvider } from './UserContext.jsx';
import UserInfo from './component/User/UserInfo.jsx';
import FavoritePost from './component/Post/FavoritePost.jsx';
import PrivateRoute from './component/Route/PrivateRoute.jsx';
import BlockAccount from './component/error/BlockAccount.jsx';
import SearchResult from './component/Post/SearchResult.jsx';
import AdminDashboard from './component/Admin/AdminDashboard.jsx';
import Home from './component/Post/Home.jsx';
import ForgotPass from './component/User/ForgotPass.jsx';


function App() {



  return (
    <Router>
    <UserProvider>
    <div className="wrapper">
        <HeaderWeb/>
        <div className='main-content'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<ListPost />} />
            <Route path="/near" element={<ListPost />} />
            <Route path="/post/:postId" element={<DetailsPost />} />
            <Route path='/register' element={<Register />}/>
            <Route path='/forgot-pass' element={<ForgotPass />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/user/:userName' element={<UserInfo/>}/>
            <Route path='/search' element={<SearchResult/>}/>
            

            <Route element={<PrivateRoute roles={'Admin'} />}>
              <Route path="/admin/manager/employee/create" element={<AdminDashboard />} />
              <Route path="/admin/manager/user" element={<AdminDashboard />} />
              <Route path="/admin/manager/employee" element={<AdminDashboard />} />
              <Route path="/admin/manager/post" element={<AdminDashboard />} />
              <Route path="/admin/manager/payment/history" element={<AdminDashboard />} />
              <Route path="/admin/manager/edit/profile" element={<AdminDashboard />} />
              <Route path="/admin/manager/change/password" element={<AdminDashboard />} />
              <Route path='/admin/manager/chart' element={<AdminDashboard/>}/>
              <Route path='/admin/manager/service' element={<AdminDashboard/>}/>
              <Route path='/admin/manager/roomType' element={<AdminDashboard/>}/>
              <Route path='/admin/manager/service/add' element={<AdminDashboard/>}/>
              <Route path='/admin/manager/roomType/add' element={<AdminDashboard/>}/>
              <Route path='/admin/manager/category' element={<AdminDashboard/>}/>
              <Route path='/admin/manager/service/add' element={<AdminDashboard/>}/>
              <Route path='/admin/manager/category/add' element={<AdminDashboard/>}/>
              <Route path='/admin/manager/service/edit/:serviceName' element={<AdminDashboard/>}/>
              <Route path='/admin/manager/roomType/edit/:typeName' element={<AdminDashboard/>}/>
              <Route path='/admin/manager/category/edit/:categoryName' element={<AdminDashboard/>}/>
            </Route>

            <Route element={<PrivateRoute roles={'User'} />}>
              <Route path="/user/manager/payment" element={<UserDashboard />} />
              <Route path="/user/manager/post/create" element={<UserDashboard />} />
              <Route path="/user/manager/post" element={<UserDashboard />} />
              <Route path="/user/manager/edit/profile" element={<UserDashboard />} />
              <Route path="/user/manager/post/edit/:postId" element={<UserDashboard />} />
              <Route path="/user/manager/post/extend/:postId" element={<UserDashboard />} />
              <Route path="/user/manager/post/service/:postId" element={<UserDashboard />} />
              <Route path="/user/manager/payment/history" element={<UserDashboard />} />
              <Route path="/user/manager/change/password" element={<UserDashboard />} />
              <Route path='/user/manager' element={<UserDashboard/>}/>
              <Route path='/user/favorite/post' element={<FavoritePost/>}/>
            </Route>
            
            
            <Route path="/block-account" element={<BlockAccount />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </div>
        <FooterWeb/>
      </div>
      </UserProvider>
    </Router>
  );
}

export default App;
