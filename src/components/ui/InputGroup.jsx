

// import { useState } from 'react';
// import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
// import { InfoIcon } from 'lucide-react';

// export const InputGroup = ({ 
//   icon: Icon, 
//   label, 
//   children, 
//   hint, 
//   warning, 
//   description 
// }) => {
//   return (
//     <div className="space-y-1">
//       <div className="flex items-center space-x-2">
//         <Icon className="h-4 w-4 text-orange-600" />
//         <label className="text-sm font-medium text-gray-700">{label}</label>
//         {description && (
//           <HoverCard>
//             <HoverCardTrigger asChild>
//               <button className="inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-100">
//                 <InfoIcon className="h-3 w-3 text-gray-500" />
//               </button>
//             </HoverCardTrigger>
//             <HoverCardContent className="w-80">
//               <div className="text-sm text-gray-600">
//                 {description}
//               </div>
//             </HoverCardContent>
//           </HoverCard>
//         )}
//       </div>
//       {children}
//       {hint && <p className="text-xs font-thin text-gray-500 mb-0 pb-0">{hint}</p>}
//       {warning && <span className="text-xs italic text-red-700 mt-0 pt-0">{warning}</span>}
//     </div>
//   );
// };

// export default InputGroup;




import { useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { InfoIcon } from 'lucide-react';

export const InputGroup = ({ 
  icon: Icon, 
  label, 
  children, 
  hint, 
  warning, 
  description 
}) => {
  // Convert string with \n to array of paragraphs
  const descriptionParagraphs = description?.split('\n').filter(Boolean);

  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4 text-orange-600" />
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {description && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-100">
                <InfoIcon className="h-3 w-3 text-gray-500" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2 text-sm text-gray-600">
                {descriptionParagraphs?.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
      {children}
      {hint && <p className="text-xs font-thin text-gray-500 mb-0 pb-0">{hint}</p>}
      {warning && <span className="text-xs italic text-red-700 mt-0 pt-0">{warning}</span>}
    </div>
  );
};

export default InputGroup;