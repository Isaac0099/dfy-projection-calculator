import { Card } from "@/components/ui/card";
import dfyHorizontal from '../../../../../public/dfyHorizontal.png'
import Image from 'next/image';

export const LogoBanner = () => {


    return(
        <div className="ml-1 mr-10 pb-5">
             <Image 
                src={dfyHorizontal}
                alt="Done For You Real Estate Logo" 
                width={488}
                height={73}
            />     
        </div>
    );

}