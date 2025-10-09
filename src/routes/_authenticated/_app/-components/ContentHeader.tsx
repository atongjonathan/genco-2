import { Link } from '@tanstack/react-router';

type ContentHeaderProps = {
  title: string;
  url: string;
};
const ContentHeader = ({ title, url }: ContentHeaderProps) => {
  return (
    <div className="app-content-header">
      {/*begin::Container*/}
      <div className="container-fluid">
        {/*begin::Row*/}
        <div className="row">
          <div className="col-sm-6">
            <h4 className="mb-0">{title}</h4>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-end">
              <li className="breadcrumb-item">
                <Link to={url}>Home</Link>
              </li>
              <li className="breadcrumb-item">{title}</li>
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
