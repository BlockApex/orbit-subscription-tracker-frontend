import React from 'react';

// Define the type for each tab
interface Tab {
    id: string;
    label: string;
}

// Props for SubscriptionTabs component
interface SubscriptionTabsProps {
    tabs: Tab[];                     // List of tabs to render
    activeTab: string;
    onTabChange: (tabId: string) => void; // Callback when a tab is clicked
}

const SubscriptionTabs: React.FC<SubscriptionTabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-4 py-1 font-medium ${activeTab === tab.id ? 'text-primary bg-primary/30 rounded-2xl' : 'text-gray-600'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default SubscriptionTabs;
