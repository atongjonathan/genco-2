import { Link } from '@tanstack/react-router';

type Link = {
  icon: string;
  url: string;
  text: string;
};
const Sidebar = () => {
  const links: Link[] = [
    {
      icon: 'house',
      url: '/',
      text: 'Dashboard',
    },
    {
      icon: 'circle',
      url: '/offtake',
      text: 'Offtake',
    },
    {
      icon: 'house',
      url: '/farmer',
      text: 'Farmers',
    },
  ];
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
            {links.map(({ url, text, icon }) => (
              <li className="nav-item">
                <Link to={url} className="nav-link">
                  <i className={`nav-icon bi bi-${icon}`}></i>
                  <p>{text}</p>
                </Link>
              </li>
            ))}
          </ul>
          {/*end::Sidebar Menu*/}
        </nav>
      </div>
      {/*end::Sidebar Wrapper*/}
    </aside>
  );
};

export default Sidebar;
