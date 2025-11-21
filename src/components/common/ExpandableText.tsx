import { useState } from "react";

const ExpandableText = ({ text = "", charLimit = 50, className = "" }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return null;

    const isLong = text.length > charLimit;
    const displayedText = isExpanded
        ? text
        : text.slice(0, charLimit) + (isLong ? "..." : "");

    return (
        <div className={className}>
            <pre className="text-sm text-foreground font-normal text-wrap whitespace-pre-line">
                {displayedText}
            </pre>
            {isLong && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-primary text-sm font-medium mt-1 hover:underline"
                >
                    {isExpanded ? "See less" : "See more"}
                </button>
            )}
        </div>
    );
};

export default ExpandableText;
