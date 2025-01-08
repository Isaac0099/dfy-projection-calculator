export const InputGroup = ({ icon: Icon, label, children, hint }) => (
    <div className="space-y-1">
        <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-orange-600" />
            <label className="text-sm font-medium text-gray-700">{label}</label>
        </div>
        {children}
        {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
);

export default InputGroup;