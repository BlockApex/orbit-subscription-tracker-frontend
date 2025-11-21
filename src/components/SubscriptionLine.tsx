import React from 'react'

interface SubscriptionLineProps {
    type: string;
}

const SubscriptionLine: React.FC<SubscriptionLineProps> = ({ type }) => {
    if (type === "Coming up") {
        return (
            <div className="absolute bottom-0 left-0 right-0 w-full h-2  overflow-hidden flex">
                {/* Left half: gradient */}
                <div className="w-1/2 h-full bg-gradient-to-r from-[#FFEDED] to-[#FFCECE]"></div>
                {/* Right half: gray */}
                <div className="w-1/2 h-full bg-[#FFCECE]"></div>
            </div>
        )
    }
    return (
        <div className="absolute bottom-0 left-0 right-0 w-full h-2  overflow-hidden flex">
            {/* Left half: gradient */}
            <div className="w-1/2 h-full bg-gradient-to-r from-[#C2FFF8] to-[#00D5BE]"></div>
            {/* Right half: gray */}
            <div className="w-1/2 h-full bg-gray-200"></div>
        </div>
    )
}

export default SubscriptionLine