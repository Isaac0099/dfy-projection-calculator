export const InputGroup = ({ icon: Icon, label, children, hint, warning}) => (
    <div className="space-y-1">
        <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-orange-600" />
            <label className="text-sm font-medium text-gray-700">{label}</label>
        </div>
        {children}
        {hint && <p className="text-xs font-thin text-gray-500 mb-0 pb-0">{hint}</p>}
        {warning && <span className="text-xs italic text-red-700 mt-0 pt-0">{warning}</span>}
    </div>
);

export default InputGroup;