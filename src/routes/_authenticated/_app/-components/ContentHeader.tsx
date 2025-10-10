import { Link } from '@tanstack/react-router';

type ContentHeaderProps = {
  title: string;
  url: string;
  heading: string;
};
const ContentHeader = ({ title, url, heading = '' }: ContentHeaderProps) => {
  return (
    <div className="app-content-header">
      {/*begin::Container*/}
      <div className="container-fluid">
        {/*begin::Row*/}
        <div className="row">
          <div className="col-sm-10 flex items-center">
            <h6 className="mb-0">{`${title} ${heading}`}</h6>
          </div>
          <div className="col-sm-2">
            <ol className="breadcrumb float-sm-end">
              <li className="breadcrumb-item">
                <Link to={url}>Home</Link>
              </li>
              {title !== 'Dashboard' && (
                <li className="breadcrumb-item">{title}</li>
              )}
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
