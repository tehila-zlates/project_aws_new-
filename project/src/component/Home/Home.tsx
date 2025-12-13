import React, { FC, useEffect, useState } from 'react';
import './Home.scss';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useWineContext } from '../../context/WineContext';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';

interface HomeProps { }

const Home: FC<HomeProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedCategory } = useWineContext();
  const [showDropdown, setShowDropdown] = useState(false);
 const dispatch = useDispatch();

//  useEffect(()=>{
//    let token= sessionStorage.getItem('my-token');
//    if(!token){
//     navigate('/Login')
//    }
//   },[])
useEffect(() => {
  const token = sessionStorage.getItem('my-token');
  const userData = sessionStorage.getItem('user-data');

  if (!token || !userData) {
    navigate('/Login');
  } else {
    dispatch(setUser(JSON.parse(userData)));
  }
}, []);
  const categories = [
    "יינות מיוחדים",
     "יינות רוזה",
    "יינות לבנים",
    "יינות אדומים",
    "היינות שלנו"
  ];

  const showVideo = location.pathname === '/Home' || location.pathname === '/Home/About';

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setShowDropdown(false);
    navigate('/Home/Wines');
  };

  return (
    <div className="Home">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">PSAGOT</a>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li
              className="nav-item dropdown"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <span className="nav-link dropdown-toggle" style={{ cursor: 'pointer' }}>
                עולם היין
              </span>
              {showDropdown && (
                <div className="dropdown-menu show">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className="dropdown-item"
                      onClick={() => handleCategoryClick(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={() => { navigate('/Home/About') }}>אודות</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={() => { navigate('/Home/ShoppingCart') }}>סל קניות</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={() => { navigate('/Home/VisitorCenter') }}>מרכז מבקרים</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={() => { navigate('/Home/CustomerDetails') }}>אזור אישי</a>
            </li>
          </ul>
        </div>
      </nav>

      {showVideo && (
        <video className="background-video" autoPlay muted loop>
          <source src="/videos/winery.mp4" type="video/mp4" />
        </video>
      )}

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
