
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
                <a href="./docs/browser-support.html" className="nav-link">
                  <i className="nav-icon bi bi-browser-edge"></i>
                  <p>Browser Support</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="./docs/how-to-contribute.html" className="nav-link">
                  <i className="nav-icon bi bi-hand-thumbs-up-fill"></i>
                  <p>How To Contribute</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="./docs/faq.html" className="nav-link">
                  <i className="nav-icon bi bi-question-circle-fill"></i>
                  <p>FAQ</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="./docs/license.html" className="nav-link">
                  <i className="nav-icon bi bi-patch-check-fill"></i>
                  <p>License</p>
                </a>
              </li>
              <li className="nav-header">MULTI LEVEL EXAMPLE</li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-circle-fill"></i>
                  <p>Level 1</p>
                </a>
              </li>
            
              
            </ul>
            {/*end::Sidebar Menu*/}
          </nav>
        </div>
        {/*end::Sidebar Wrapper*/}
      </aside>
  )
}

export default Sidebar
