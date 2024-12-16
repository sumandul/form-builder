import BindContentContainer from '@Components/common/BindContentContainer';
import adminDashboardRoutes from '@Routes/adminDashboardRoutes';
import generateRoutes from '@Routes/generateRoutes';
import { NavLink } from 'react-router-dom';

const sideBarLinks = [
  { id: '1', name: 'CATEGORY MANAGEMENT', link: '/category-management' },
  { id: '4', name: 'LAYER VISUALIZATION', link: '/layer-visualization' },
  { id: '2', name: 'ANALYTICS GRAPH', link: '/analythics-graph' },
  { id: '5', name: 'ALERT LOGS', link: '/alert-logs' },
  { id: '6', name: 'USER MANAGEMENT', link: '/user-management' },
  { id: '7', name: 'LAYER INFO MANAGEMENT', link: '/layer-info-management' },
  { id: '7', name: 'EMAIL CHANNEL', link: '/email-channel' },
];

export default function AdminDashboard() {
  return (
    <BindContentContainer className="m-auto flex h-[calc(100vh-90px)] max-w-[90rem]  flex-col px-10 py-6">
      <h6 className="mb-6">Admin Panel</h6>
      <div className="flex h-full">
        <div className="sidebar flex w-fit flex-col bg-gray-50">
          {sideBarLinks.map(link => (
            <NavLink
              key={link.id}
              type="button"
              to={`/admin-dashboard${link.link}`}
              className={navData =>
                `h-[2.75rem] w-[16.25rem] px-5 py-3 text-left transition-all duration-200 ${
                  navData.isActive
                    ? 'bg-[#14428B] text-white'
                    : 'bg-gray-50 text-black hover:bg-[#14428B] hover:text-white '
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
        <div
          className="playground scrollbar w-4/5 overflow-y-auto px-10 "
          style={{ scrollbarGutter: 'stable' }}
        >
          {generateRoutes({ routes: adminDashboardRoutes })}
        </div>
      </div>
    </BindContentContainer>
  );
}
