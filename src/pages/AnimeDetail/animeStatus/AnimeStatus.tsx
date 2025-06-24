import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
const statuses = [
    "Tanlanmadi",
    "Ko'rildi",
    "Tashlandi",
    "Qoldirildi",
    "Ko'rilmoqda",
    "Rejada"
];

const StatusDropdown = () => {
    const [status, setStatus] = useState("Не выбрано");
    const [showDropdown, setShowDropdown] = useState(false);
    
    // Setstate to store the selected status if it exists in localStorage
    useEffect(() => {
        const storedStatus = localStorage.getItem('status');
        if (storedStatus) {
            setStatus(storedStatus);
        }
    }, []);
    
    return (
        <div className="relative inline-block text-left">
        <div>
        <button
        type="button"
        className="inline-flex justify-between items-center w-44 px-4 py-2 bg-zinc-800 text-gray-200 font-medium rounded-full shadow-sm hover:bg-zinc-700 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        onClick={() => setShowDropdown(!showDropdown)}
        onMouseEnter={() => setShowDropdown(true)}
        >
        {status}
        <ChevronDown className="ml-2 w-4 h-4 text-gray-300" />
        </button>
        </div>
        
        {showDropdown &&
            <div className="absolute mt-2 w-44 rounded-lg shadow-lg bg-zinc-800 ring-1 ring-black/10 z-50"
            onMouseLeave={() => setShowDropdown(false)}
            >
            <ul className="py-1">
            {statuses.map((s) => (
                <li key={s}>
                <button
                onClick={() => {
                    setStatus(s);
                    localStorage.setItem('status', s); // Save selected status to localStorage
                    setShowDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 hover:text-white text-gray-300 transition-colors ${status === s ? 'bg-zinc-700 text-white font-semibold' : ''
                }`}
                >
                {s}
                </button>
                </li>
            ))}
            </ul>
            </div>
        }
        </div>
    );
};

export default StatusDropdown;