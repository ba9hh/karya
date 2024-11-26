import {useContext,useState} from 'react'
import { AuthContext } from '../AuthProvider';
import axios from 'axios';
const AddNumber = ({onClose}) => {
    const {  setUser } = useContext(AuthContext);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error,setError] =useState("")

    const validatePhoneNumber = (number) => {
        const regex = /^\d{8}$/; // Regex for exactly 8 digits
        return regex.test(number);
      };
    
      const handlePhoneNumberChange = (e) => {
        const newNumber = e.target.value;
        setPhoneNumber(newNumber);
    
        // Validate phone number format
        if (newNumber && !validatePhoneNumber(newNumber)) {
          setError("Phone number must be exactly 8 digits.");
        } else if (
          newNumber === "" 
        ) {
          setError("you need to set a number");
        } else {
          setError("");
        }
      };
      const handleNumberValidation = async () => {
        if (error) {
          alert("Please correct the errors before saving.");
          return;
        }
    
        try {
          const response = await axios.put(
            "http://localhost:3000/api/update-user-number",
            {
              phoneNumber,
            }
          );
          alert("Details updated successfully!");
          onClose()
          setUser(response.data);
        } catch (error) {
          console.error("Error updating user details:", error);
          alert("Failed to update details. Please try again.");
        }
      };
  return (
    <div>
    
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-1/4 p-6  bg-white rounded-lg shadow-lg">
            <button
              className="absolute top-0 right-2 text-2xl text-gray-600 hover:text-gray-900"
              onClick={onClose}
            >
              &times;
            </button>
            <h2 className=" text-center">
              Ajouter votre numero de telephone
            </h2>
            <div className="flex gap-2 mt-4">
              <input
            className="px-2 py-1 w-full border"
            type="text"
            placeholder="ecrivez-la"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
          <button className="px-2 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
          onClick={handleNumberValidation}>
            valider
          </button>
            </div>
            
    
          </div>
        </div>
      </div>
  )
}

export default AddNumber
