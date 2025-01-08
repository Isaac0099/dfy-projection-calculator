// import React from 'react';
// import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
// import Image from 'next/image';

// const WelcomeBanner = ({ DFYLogo }) => {
//   return (
//     <Alert className="bg-gray-50 border-l-8 border-l-orange-400 border-y-0 border-r-0 shadow-sm">
//       <div className="flex items-center gap-6 py-2">
//           <Image 
//             src={DFYLogo}
//             alt="Done For You Real Estate Logo" 
//             width={100}
//             height={100}
//           />        
//         <div className="flex-1 space-y-0">
//           <div className="flex items-center ">
//             <AlertTitle className="text-2xl font-extrabold">
//               DFY Portfolio Growth and Income Simulator
//             </AlertTitle>
//           </div>
          
//           <AlertDescription className="text-gray-700 text-base">
//             See what your financial future can be with this interactive tool.
//           </AlertDescription>
          
//           <div className="flex gap-6 pt-2">
//             <div className=" text-gray-600">
//               <p className="text-sm italic">
//                 Enter a portfolio of investment properties you may purchase over time and see what happens when the dynamic attributes of real estate investing take over to grow your future tax-free income, wealth and legacy.
//               </p>
//             </div>
           
//           </div>
//         </div>
//       </div>
//     </Alert>
//   );
// };

// export default WelcomeBanner;


import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';

const WelcomeBanner = ({ DFYLogo }) => {
  return (
    <Alert className="bg-gray-50 border-l-8 border-l-orange-400 border-y-0 border-r-0 shadow-sm">
      <div className="flex items-center gap-6 py-2">
        <Image 
          src={DFYLogo}
          alt="Done For You Real Estate Logo" 
          width={100}
          height={100}
        />        
        <div className="flex-1 space-y-0">
          <div className="flex items-center">
            <AlertTitle className="text-2xl font-extrabold">
              DFY Portfolio Growth and Income Simulator
            </AlertTitle>
          </div>
          
          <AlertDescription className="text-gray-700 text-base">
            See what your financial future can be with this interactive tool.
          </AlertDescription>
          
          <div className="flex pt-2">
            <div className="text-gray-600 max-w-2xl">
              <p className="text-sm italic leading-relaxed">
                Enter a portfolio of investment properties you may purchase over time 
                and see what happens when the dynamic attributes of real estate investing 
                take over to grow your future tax-free income, wealth and legacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Alert>
  );
};

export default WelcomeBanner;