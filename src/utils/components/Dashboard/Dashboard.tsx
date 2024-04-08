import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';

type DashboardProps = {
  children: ReactNode;
  className?: string;
};

const Dashboard: FC<DashboardProps> = ({ children, className }) => (
  <div className={classNames('co-dashboard-body', className)} data-test-id="dashboard">
    {children}
  </div>
);

export default Dashboard;
