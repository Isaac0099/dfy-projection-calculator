import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ExistingPropertyToggle = ({ isChecked, onToggle }) => {
  return (
    <div className="flex items-center space-x-2 mt-1">
      <Checkbox
        id="property-ownership"
        checked={isChecked}
        onCheckedChange={onToggle}
        className="border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
      />
      <Label
        htmlFor="property-ownership"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        This is a Previously Owned Investment Property
      </Label>
    </div>
  );
};
export default ExistingPropertyToggle;