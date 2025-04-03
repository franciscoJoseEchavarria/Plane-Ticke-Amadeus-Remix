import { Link } from "@remix-run/react";
import { 
  Home,
  Users, 
  FileText, 
  BarChart, 
  Building
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
        <NavItem to="/dashboard" icon={<Home size={20} />} label="Dashboard" />
        <NavItem to="/reportUser" icon={<Users size={20} />} label="Users" />
        <NavItem to="/questions" icon={<FileText size={20} />} label="Questions" />
        <NavItem to="/questionsoption" icon={<FileText size={20} />} label="Questions Options" />
        <NavItem to="/cities" icon={<Building size={20} />} label="Cities" />
        <NavItem to="/reports" icon={<BarChart size={20} />} label="Reports" />
      </nav>
    </aside>
  );
};

export default AdminSidebar;