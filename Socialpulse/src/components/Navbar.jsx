import { Activity } from "lucide-react";
const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Activity className="w-8 h-8 text-gray-800 mr-2" />
              <h1 className="text-xl font-bold text-gray-800">Social Pulse</h1>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
