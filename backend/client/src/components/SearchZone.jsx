import { useContext, useState,useEffect } from "react";
import sidibousaid from "../assets/images/sidibou.png";
import searchbtn from "../assets/icons/searchbtn.png";
import TunisiaMap from "./TunisiaMap";
import { SearchContext } from "../SearchProvider";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    // Automatically close the toast after 3 seconds
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-gradient-to-r from-green-400 to-green-600 text-white py-3 px-6 rounded-lg shadow-xl transform transition-all duration-500 ease-in-out opacity-100 scale-100">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m0 0L9 12m4-4l4 4-4-4z"
            />
          </svg>
          {message}
        </div>
      </div>
    </div>
  );
};

const SearchNav = () => {
  const {searchHouses,setResults,showToast,setShowToast} = useContext(SearchContext);
  const [wilaya, setWilaya] = useState("wilaya");
  const [mo3tamdiya, setMo3tamdiya] = useState("mo3tamdiya");
  const [chkon, setChkon] = useState("lchkon dar");
  const [chambre, setChambre] = useState("nbr de chambres");
  console.log(chambre)
  const handleSearch = () => {
    const lchkon=chkon.split(" ").slice(-2).join(" ")
    console.log(lchkon)
    if(lchkon=="lchkon dar"  && wilaya=="wilaya" && mo3tamdiya=="mo3tamdiya" && chambre=="nbr de chambres"){
      setResults([])
    }else{
      searchHouses({ wilaya, mo3tamdiya,lchkon,chambre}); // Call the context function to update filters and results
    }
};
  return (
    <div>
      <h1 className=" text-white text-center text-[40px] crimsonText mb-4">
        Bienvenue à Karya
      </h1>
      <div className="flex justify-center items-center">
        <div className="flex w-fit  px-4 py-3 rounded-full bg-[#F7F7F7] border border-[#F7F7F7] shadow-xl">
          <TunisiaMap buttonStyle="border text-[20px] text-[#6D6D6D] px-4 calibri" setWilaya1={setWilaya} setMo3tamdiya1={setMo3tamdiya} setChkon1={setChkon} setChambre1={setChambre}  wilaya1={wilaya} mo3tamdiya1={mo3tamdiya} chkon1={chkon} chambre1={chambre} />
        </div>
        <img className=" h-12 w-12 searchAnimation cursor-pointer"
        onClick={handleSearch}
        src={searchbtn} />
      </div>
      {showToast &&<Toast message="mafamesh dyar bl mouwasafat li hatathom" onClose={()=>{setShowToast(false)}}/>}
    </div>
  );
};

const SearchZone = () => {
  return (
    <>
      <div
        className="flex flex-col justify-center h-[91vh] bg-contain bg-center "
        style={{ backgroundImage: `url(${sidibousaid})` }}
      >
        <div className="mb-16">
          <SearchNav />
        </div>
      </div>
      <div className="flex flex-col justify-center h-[65px] bg-[#F2ECE3] overflow-hidden">
        <div className=" flex overflow-hidden gap-5">
          <div className="flex  animate-loop-scroll whitespace-nowrap gap-5">
            <h1 className=" text-[26px] text-[#6B6B6B] calibriBold ">
              Decouvrir des maisons pour les etudiants
            </h1>
            <h1 className=" text-[26px] text-[#6B6B6B] calibriBold ">
              Decouvrir des maisons pour une famille
            </h1>
            <h1 className=" text-[26px] text-[#6B6B6B] calibriBold ">
              Decouvrir des maisons pour la vacance
            </h1>
          </div>
          <div
            className="flex animate-loop-scroll whitespace-nowrap gap-5"
            aria-hidden="true"
          >
            <h1 className=" text-[26px] text-[#6B6B6B] calibriBold ">
              Decouvrir des maisons pour les etudiants
            </h1>
            <h1 className=" text-[26px] text-[#6B6B6B] calibriBold ">
              Decouvrir des maisons pour une famille
            </h1>
            <h1 className=" text-[26px] text-[#6B6B6B] calibriBold ">
              Decouvrir des maisons pour la vacance
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchZone;
