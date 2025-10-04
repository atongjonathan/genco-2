import { Link } from '@tanstack/react-router';

const ContentHeader = () => {
  return (
    <div className="app-content-header">
      {/*begin::Container*/}
      <div className="container-fluid">
        {/*begin::Row*/}
        <div className="row">
          <div className="col-sm-6">
            <h4 className="mb-0">Dashboard</h4>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-end">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">Dashboard</li>
            </ol>
          </div>
        </div>
        {/*end::Row*/}
      </div>
      {/*end::Container*/}
    </div>
  );
};

export default ContentHeader;
