// // ExistingPropertyToggle.jsx

import { Switch } from "@/components/ui/switch";

const ExistingPropertyToggle = ({ isChecked, onToggle }) => {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs ${!isChecked ? "font-semibold" : "text-gray-500"}`}>New</span>
      <Switch id="property-ownership" checked={isChecked} onCheckedChange={onToggle} className="mx-1" />
      <span className={`text-xs ${isChecked ? "font-semibold" : "text-gray-500"}`}>Existing</span>
    </div>
  );
};

export default ExistingPropertyToggle;
