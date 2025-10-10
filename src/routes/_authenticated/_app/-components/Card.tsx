import { clsx } from 'clsx';
import React, { useState } from 'react';

interface CardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  tools?: React.ReactNode;
  color?:
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'dark';
  outline?: boolean;
  collapsible?: boolean;
  initialCollapsed?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  tools,
  color = 'primary',
  outline = false,
  collapsible = false,
  initialCollapsed = false,
  className,
}) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const cardClass = clsx(
    'card',
    outline ? `card-outline card-${color}` : `card-${color}`,
    className,
  );

  return (
    <div className={cardClass}>
      {(title || tools || collapsible) && (
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">{title}</h3>

          <div className="card-tools d-flex align-items-center gap-1">
            {tools}
            {collapsible && (
              <button
                title="Close"
                type="button"
                className="btn btn-tool"
                onClick={() => setCollapsed(!collapsed)}
              >
                <i className={`fas fa-${collapsed ? 'plus' : 'minus'}`}></i>
              </button>
            )}
          </div>
        </div>
      )}

      {!collapsed && <div className="card-body">{children}</div>}

      {footer && !collapsed && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
