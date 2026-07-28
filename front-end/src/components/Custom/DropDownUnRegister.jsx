import { ChevronDown } from 'lucide-react';
import { useState } from 'react'

const DropDownUnRegister = ({options, onValueSelect}) => {

    const [optionOpen, setOptionOpen] = useState(false);
    
    const [option, setOption] = useState(options[0] || "")
   
    
  return (
     <div className="relative w-full pt-2">
         <button
             type="button"
             onClick={() => setOptionOpen((p) => !p)}
             className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-white text-sm font-semibold text-gray-800 hover:border-[#0A6E5C] transition-colors"
         >
             {option}
             <ChevronDown
                 size={16}
                 className={`text-gray-400 transition-transform ${optionOpen ? "rotate-180" : ""}`}
             />
         </button>
         {optionOpen && (
             <div className="absolute top-full left-0 right-0 z-9999 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-full">
                 { options && options.map((opt) => (
                     <button
                         key={opt}
                         type="button"
                         onClick={() => {
                            setOption(opt);
                            onValueSelect(opt);
                            setOptionOpen(false);
                         }}
                         className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${option === opt
                             ? "bg-emerald-50 text-[#0A6E5C]"
                             : "text-gray-700 hover:bg-gray-50"
                             }`}
                     >
                         {opt}
                     </button>
                 ))}
             </div>
         )}
     </div>
  )
}

export default DropDownUnRegister