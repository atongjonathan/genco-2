import { useAuth } from '@/auth';
import React, { useEffect } from 'react';

export const handleSidebarToggle = () => {
  const body = document.body;
  if (body.classList.contains('sidebar-open')) {
    body.classList.remove('sidebar-open');
    body.classList.add('sidebar-collapse');
  } else {
    body.classList.remove('sidebar-collapse');
    body.classList.add('sidebar-open');
  }
};
const Header = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  // Sidebar closed by default on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      document.body.classList.add('sidebar-collapse');
      document.body.classList.remove('sidebar-open');
    }
    // Cleanup: remove sidebar-open on unmount
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, []);

  // Click elsewhere closes sidebar
  useEffect(() => {
    const handleDocumentClick = () => {
      const sidebar = document.querySelector('.main-sidebar');
      const toggler = document.querySelector('[data-lte-toggle="sidebar"]');
      if (
        document.body.classList.contains('sidebar-open') &&
        sidebar &&
        toggler
      ) {
        document.body.classList.remove('sidebar-open');
        document.body.classList.add('sidebar-collapse');
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <nav className="app-header navbar navbar-expand bg-body">
      {/*begin::Container*/}
      <div className="container-fluid">
        {/*begin::Start Navbar Links*/}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-lte-toggle="sidebar"
              href="#"
              role="button"
              onClick={handleSidebarToggle}
            >
              <i className="bi bi-list"></i>
            </a>
          </li>
          {/* <li className="nav-item d-none d-md-block"><a href="#" className="nav-link">Home</a></li>
          <li className="nav-item d-none d-md-block"><a href="#" className="nav-link">Contact</a></li> */}
        </ul>
        {/*end::Start Navbar Links*/}
        {/*begin::End Navbar Links*/}
        <ul className="navbar-nav ms-auto">
          {/*begin::User Menu Dropdown*/}
          <li className="nav-item dropdown user-menu" onClick={handleLogout}>
            <a
              href="#"
              className="nav-link dropdown-toggle flex"
              data-bs-toggle="dropdown"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={user?.picture}
                className="user-image rounded-circle shadow"
                alt="User Image"
              />
            </a>
            <ul
              className={`dropdown-menu dropdown-menu-lg dropdown-menu-start ${dropdownOpen ? 'show' : ''}`}
            >
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
              <li className="user-body">
                <div className="row">
                  <div className="col-4 text-center">
                    <a href="#">Followers</a>
                  </div>
                  <div className="col-4 text-center">
                    <a href="#">Sales</a>
                  </div>
                  <div className="col-4 text-center">
                    <a href="#">Friends</a>
                  </div>
                </div>
              </li>
              <li className="user-footer">
                <a href="#" className="btn btn-default btn-flat">
                  Profile
                </a>
                <a href="#" className="btn btn-default btn-flat float-end">
                  Sign out
                </a>
              </li>
            </ul>
          </li>
          {/*end::User Menu Dropdown*/}
        </ul>
        {/*end::End Navbar Links*/}
      </div>
      {/*end::Container*/}
    </nav>
  );
};

export default Header;
