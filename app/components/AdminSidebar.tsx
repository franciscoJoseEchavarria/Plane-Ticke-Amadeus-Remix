import { Link } from "@remix-run/react";
import { 
    HomeIcon, 
    UsersIcon, 
    FileTextIcon, 
    BarChartIcon, 
    BuildingIcon 
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <Link 
    to={to} 
    className="flex items-center space-x-3 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-blue-950 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <NavItem to="/dashboard" icon={<HomeIcon size={20} />} label="Dashboard" />
        <NavItem to="/users" icon={<UsersIcon size={20} />} label="Users" />
        <NavItem to="/questionsAdmin" icon={<FileTextIcon size={20} />} label="Questions" />
        <NavItem to="/questionsoption" icon={<FileTextIcon size={20} />} label="Questions Options" />
        <NavItem to="/cities" icon={<BuildingIcon size={20} />} label="Cities" />
        <NavItem to="/reports" icon={<BarChartIcon size={20} />} label="Reports" />
      </nav>
    </aside>
  );
};

export default AdminSidebar;