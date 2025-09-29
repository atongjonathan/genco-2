import { useAuth } from '@/auth'
import React from 'react'

const Header = () => {
    const { user, logout } = useAuth()

    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    
  return (
     <nav className="app-header navbar navbar-expand bg-body">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Start Navbar Links*/}
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" data-lte-toggle="sidebar" href="#" role="button">
                <i className="bi bi-list"></i>
              </a>
            </li>
            <li className="nav-item d-none d-md-block"><a href="#" className="nav-link">Home</a></li>
            <li className="nav-item d-none d-md-block"><a href="#" className="nav-link">Contact</a></li>
          </ul>
          {/*end::Start Navbar Links*/}
          {/*begin::End Navbar Links*/}
          <ul className="navbar-nav ms-auto">

            {/*end::Fullscreen Toggle*/}
            {/*begin::User Menu Dropdown*/}
            <li className="nav-item dropdown user-menu" onClick={logout}>
              <a href="#" className="nav-link dropdown-toggle flex" data-bs-toggle="dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img
                  src={user?.picture}
                  className="user-image rounded-circle shadow"
                  alt="User Image"
                />
                {/* <span className="d-none d-md-inline">{user?.name}</span> */}
              </a>
              <ul className={ `dropdown-menu dropdown-menu-lg dropdown-menu-start ${dropdownOpen ? 'show' : ''}` }>
                {/*begin::User Image*/}
                <li className="user-header text-bg-primary">
                  <img
                    src={user?.picture}
                    className="rounded-circle shadow"
                    alt="User Image"
                  />
                  <p>
                    {user?.name} - Web Developer
                    <small>Member since Nov. 2023</small>
                  </p>
                </li>
                {/*end::User Image*/}
                {/*begin::Menu Body*/}
                <li className="user-body">
                  {/*begin::Row*/}
                  <div className="row">
                    <div className="col-4 text-center"><a href="#">Followers</a></div>
                    <div className="col-4 text-center"><a href="#">Sales</a></div>
                    <div className="col-4 text-center"><a href="#">Friends</a></div>
                  </div>
                  {/*end::Row*/}
                </li>
                {/*end::Menu Body*/}
                {/*begin::Menu Footer*/}
                <li className="user-footer">
                  <a href="#" className="btn btn-default btn-flat">Profile</a>
                  <a href="#" className="btn btn-default btn-flat float-end">Sign out</a>
                </li>
                {/*end::Menu Footer*/}
              </ul>
            </li>
            {/*end::User Menu Dropdown*/}
          </ul>
          {/*end::End Navbar Links*/}
        </div>
        {/*end::Container*/}
      </nav>
  )
}

export default Header
