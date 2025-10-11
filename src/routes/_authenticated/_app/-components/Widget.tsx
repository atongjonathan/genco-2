import React from 'react';

export interface WidgetProps {
  title?: string;
  value?: string | number;
  icon?: string;
  link?: string;
  backgroundColor?: string;
  description?: string;
}

const Widget: React.FC<WidgetProps> = ({
  title,
  value,
  icon,
  backgroundColor,
  description,
}) => {
  return (
    <div className="col-12 col-sm-6 col-md-3">
      <div className="info-box">
        <span className={`info-box-icon text-bg-${backgroundColor} shadow-sm`}>
          <i className={`bi bi-${icon}`}></i>
        </span>
        <div className="info-box-content">
          <span className="info-box-text text-wrap">{title}</span>
          <span className="info-box-number">{value}</span>
          <span className="info-box-text text-wrap">{description}</span>

          {/* <p
            className="d-inline-block text-wrap text-sm fs-6 fw-light"
            style={{ maxWidth: '100px' }}
          >
            {description}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Widget;
