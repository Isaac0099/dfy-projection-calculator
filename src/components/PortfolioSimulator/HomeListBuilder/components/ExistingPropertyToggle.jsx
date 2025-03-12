import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ExistingPropertyToggle = ({ isChecked, onToggle }) => {
  return (
    <div className="flex items-center justify-between">
  {/* <Checkbox
        id="property-ownership"
        checked={isChecked}
        onCheckedChange={onToggle}
        className="border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
      /> */}
      <div className="flex items-center space-x-1">
      <p className="text-sm font-medium">
            Is this a previously owned home?
      </p>
      </div>
      <div className="flex items-center space-x-1">
      <span className={`text-sm ${!isChecked ? 'font-medium' : 'text-gray-500'}`}>
            No
      </span>
        <Switch
          id="property-ownership"
          checked={isChecked}
          onCheckedChange={onToggle}
        />
        <span className={`text-sm ${isChecked ? 'font-medium' : 'text-gray-500'}`}>
              Yes
        </span>
      </div>
    </div>
  );
};
export default ExistingPropertyToggle;