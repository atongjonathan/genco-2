import { Link } from '@tanstack/react-router';

const Sidebar = () => {
  return (
    <aside className="app-sidebar bg-body-secondary shadow">
      {/*begin::Sidebar Brand*/}
      <div className="sidebar-brand">
        {/*begin::Brand Link*/}
        <a href="./index.html" className="brand-link">
          {/*begin::Brand Image*/}
          <img
            src="/logo%20copy.png"
            alt="AdminLTE Logo"
            className="brand-image opacity-75 shadow"
          />
          {/*end::Brand Image*/}
          {/*begin::Brand Text*/}
          <span className="brand-text fw-light">Savanna Herds</span>
          {/*end::Brand Text*/}
        </a>
        {/*end::Brand Link*/}
      </div>
      {/*end::Sidebar Brand*/}
      {/*begin::Sidebar Wrapper*/}
      <div className="sidebar-wrapper">
        <nav className="mt-2">
          {/*begin::Sidebar Menu*/}
          <ul
            className="nav sidebar-menu flex-column"
            data-lte-toggle="treeview"
            role="navigation"
            aria-label="Main navigation"
            data-accordion="false"
            id="navigation"
          >
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <i className="nav-icon bi bi-house"></i>
                <p>Dashboard</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/offtake" className="nav-link">
                <i className="nav-icon bi bi-circle"></i>
                <p>Offtake</p>
              </Link>
            </li>
          </ul>
          {/*end::Sidebar Menu*/}
        </nav>
      </div>
      {/*end::Sidebar Wrapper*/}
    </aside>
  );
};

export default Sidebar;
