import { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

// Status tipini belgilaymiz
interface Status {
    key: string;
    label: string;
    color: string;
}

const statuses: Status[] = [
    { key: "not_selected", label: "Tanlanmadi", color: "text-gray-400" },
    { key: "watched", label: "Ko'rildi", color: "text-emerald-400" },
    { key: "dropped", label: "Tashlandi", color: "text-red-400" },
    { key: "on_hold", label: "Qoldirildi", color: "text-yellow-400" },
    { key: "watching", label: "Ko'rilmoqda", color: "text-blue-400" },
    { key: "plan_to_watch", label: "Rejada", color: "text-purple-400" }
];

const StatusDropdown = () => {
    const [selectedStatus, setSelectedStatus] = useState(statuses[0]);
    const [showDropdown, setShowDropdown] = useState(false);
   
    // Load saved status from memory (localStorage alternative)
    useEffect(() => {
        // For demo purposes, we'll use a simple state management
        // In a real app, you'd use React context or state management
    }, []);
   
    const handleStatusChange = (status: Status) => {
        setSelectedStatus(status);
        setShowDropdown(false);
        // Save to memory instead of localStorage
        console.log('Status saved:', status.label);
    };

    return (
        <div className="relative inline-block text-left font-sans">
            {/* Main Button */}
            <div>
                <button
                    type="button"
                    className="group relative inline-flex justify-between items-center w-52 px-5 py-3 
                             bg-(--bg-color)/40 backdrop-blur-xl border border-white/10
                             text-gray-200 font-medium rounded-xl shadow-2xl
                             hover:bg-black/60 hover:border-white/20 hover:shadow-purple-500/20
                             transition-all duration-300 ease-out
                             focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    onClick={() => setShowDropdown(!showDropdown)}
                    onMouseEnter={() => setShowDropdown(true)}
                >
                    {/* Status indicator dot */}
                    <div className="flex items-center space-x-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${selectedStatus.color.replace('text-', 'bg-')} 
                                       shadow-lg ring-2 ring-black/20`}></div>
                        <span className={`${selectedStatus.color} font-medium`}>
                            {selectedStatus.label}
                        </span>
                    </div>
                    
                    <ChevronDown className={`ml-2 w-5 h-5 text-gray-400 transition-transform duration-200 
                                           ${showDropdown ? 'rotate-180' : ''}`} />
                    
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-blue-500/0 
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            </div>
       
            {/* Dropdown Menu */}
            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowDropdown(false)}
                    ></div>
                    
                    {/* Dropdown Panel */}
                    <div className="absolute mt-3 w-52 rounded-xl shadow-2xl 
                                   bg-black/60 backdrop-blur-2xl border border-white/10
                                   ring-1 ring-purple-500/20 z-1000
                                   transform transition-all duration-300 ease-out
                                   animate-in fade-in-0 slide-in-from-top-1 zoom-in-95
                                   opacity-100 scale-100 translate-y-0"
                         onMouseLeave={() => setShowDropdown(false)}>
                        
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-white/10">
                            <p className="text-sm font-medium text-gray-300/80">Status tanlang</p>
                        </div>
                        
                        {/* Options */}
                        <div className="py-2">
                            {statuses.map((status) => (
                                <button
                                    key={status.key}
                                    onClick={() => handleStatusChange(status)}
                                    className={`group w-full text-left px-4 py-3 text-sm 
                                               transition-all duration-200 ease-out
                                               hover:bg-white/10 hover:translate-x-1
                                               ${selectedStatus.key === status.key 
                                                 ? 'bg-white/5 border-r-2 border-purple-400' 
                                                 : ''}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            {/* Status dot */}
                                            <div className={`w-2.5 h-2.5 rounded-full ${status.color.replace('text-', 'bg-')} 
                                                           shadow-md ring-1 ring-black/20
                                                           group-hover:scale-110 transition-transform duration-200`}>
                                            </div>
                                            <span className={`${status.color} font-medium group-hover:text-white 
                                                           transition-colors duration-200`}>
                                                {status.label}
                                            </span>
                                        </div>
                                        
                                        {/* Check mark for selected */}
                                        {selectedStatus.key === status.key && (
                                            <Check className="w-4 h-4 text-purple-400" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        {/* Footer gradient */}
                        <div className="h-1 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-emerald-500/30 rounded-b-xl blur-sm"></div>
                    </div>
                </>
            )}
        </div>
    );
};

export default StatusDropdown;