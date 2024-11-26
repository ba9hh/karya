function CustomCheckbox({ label, checked, onChange }) {
    return (
      <label className="flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onChange} 
          className="hidden peer" 
        />
        <span className=" text-gray-700 border pb-1">{label}</span>
        <span className="ml-1 w-5 h-5 border-2 border-gray-400 rounded-sm peer-checked:bg-green-500 peer-checked:border-green-500 transition-colors duration-200 flex justify-center items-center">
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        
      </label>
    );
  }
  export default CustomCheckbox;  