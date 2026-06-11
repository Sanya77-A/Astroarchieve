import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MdHome } from 'react-icons/md';

const routeLabels = {
  '/': 'Dashboard',
  '/consultations': 'Consultations',
  '/consultations/add': 'Add Consultation',
  '/clients': 'Clients',
  '/activity': 'Activity',
};

const Header = () => {
  const location = useLocation();

  const getLabel = () => {
    const path = location.pathname;
    if (path.startsWith('/consultations/view/')) return 'View Consultation';
    if (path.startsWith('/consultations/edit/')) return 'Edit Consultation';
    if (path.startsWith('/clients/')) return 'Client Profile';
    return routeLabels[path] || 'Dashboard';
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs = [{ label: 'Home', path: '/' }];
    if (path === '/') return crumbs;
    if (path.startsWith('/consultations')) {
      crumbs.push({ label: 'Consultations', path: '/consultations' });
      if (path.includes('/add')) crumbs.push({ label: 'Add', path: null });
      else if (path.includes('/view/')) crumbs.push({ label: 'View', path: null });
      else if (path.includes('/edit/')) crumbs.push({ label: 'Edit', path: null });
    } else if (path.startsWith('/clients')) {
      crumbs.push({ label: 'Clients', path: '/clients' });
      if (path.length > '/clients'.length) crumbs.push({ label: 'Profile', path: null });
    } else if (path === '/activity') {
      crumbs.push({ label: 'Activity', path: null });
    }
    return crumbs;
  };

  const crumbs = getBreadcrumbs();

  return (
    <header className="bg-white border-b border-slate-200 h-14 flex items-center px-6 gap-3 flex-shrink-0">
      <div className="flex items-center gap-2 text-sm min-w-0">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-slate-300">/</span>}
            {c.path ? (
              i === 0 ? (
                <Link to={c.path} className="text-slate-400 hover:text-indigo-600 transition-colors">
                  <MdHome className="w-4 h-4" />
                </Link>
              ) : (
                <Link to={c.path} className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">{c.label}</Link>
              )
            ) : (
              <span className="text-slate-800 font-semibold">{c.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="ml-auto">
        <h2 className="text-base font-bold text-slate-800">{getLabel()}</h2>
      </div>
    </header>
  );
};

export default Header;
