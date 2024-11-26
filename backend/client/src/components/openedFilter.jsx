import React, { useState , useContext } from "react";
import Counter from "./counter";
import CustomCheckbox from "./checkbox";
import wilayat from "../data/wilayat";
import mo3tamdiyat from "../data/mo3tamdiyat";
import { SearchContext } from "../SearchProvider";

const OpenedFilter = ({ open, setOpen, filter }) => {
  const [wilayaIndex, setWilayaIndex] = useState(0);
  const [openedWindow, setWindow] = useState(filter);
  const [isOpen, setIsOpen] = useState(false);
  const [prixOption, setPrixOption] = useState("jour/semaine/moins")
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle option selection
  const handleOptionClick = (option) => {
    setPrixOption(option); // Update selected option
    setIsOpen(false); // Close dropdown after selecting
  };
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [selectedValues, setSelectedValues] = useState({
    wilaya: "",
    mo3tamdiya: "",
    lchkon: "",
    nbrChambres: null,
    typeDar: "",
    autres: [],
  });
  const chfamaAkher = [
    "meublé",
    "Balcon",
    "Jarda",
    "gaz de ville",
    "Climatiseur",
  ];
  const chkonList = [
    "c'est pour une famille",
    "c'est pour des etudiants",
    "c'est pour des voyageurs",
  ];
  const filters = [
    "type mta3 dar",
    "prix",
    "wilaya",
    "mo3tamdiya",
    "lchkon dar",
    "nbr de chambre",
    "autres",
  ];

  const { searchHousesv2,setResults } = useContext(SearchContext);

  const handleSearch =()=>{
    const lchkon=(selectedValues.lchkon)?(selectedValues.lchkon).split(" ").slice(-2).join(" "):""
    const mo3tamdiya = selectedValues.mo3tamdiya
    const wilaya = selectedValues.wilaya
    const chambre = selectedValues.nbrChambres
    const typeDar = selectedValues.typeDar
    const autres = selectedValues.autres
    
    if(wilaya== "" && mo3tamdiya== "" && lchkon== "" && chambre== null && typeDar== "" && autres.length==0 && prixMax=="" && prixMin==""){
      setResults([])
    }else{
      searchHousesv2({ wilaya, mo3tamdiya,lchkon,chambre,typeDar,prixMin,prixMax,prixOption,autres});
    }
    setOpen(!open)
  }



  const incrementCount = () => {
    if (selectedValues.nbrChambres === null) {
      updateSelectedValues("nbrChambres", 0);
    } else {
      updateSelectedValues("nbrChambres", selectedValues.nbrChambres + 1);
    }
  };

  // Function to decrease the count
  const decrementCount = () => {
    if (selectedValues.nbrChambres > 0) {
      // Ensures the  count doesn't go below 1
      updateSelectedValues("nbrChambres", selectedValues.nbrChambres - 1);
    } else {
      updateSelectedValues("nbrChambres", null);
    }
  };
  const updateSelectedValues = (field, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const removeArrayValue = (field, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }));
  };
  const removeSelectedValue = (field) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: field === "nbrChambres" ? null : "",
    }));
  };
  const removePriceValue = () => {
    setPrixMax("");
    setPrixMin("");
  };
  const FilterWrapper = ({ children }) => (
    <div className="flex h-full">
      <div className="w-1/6 h-full border flex flex-col gap-2 p-3">
        <h3 className="font-semibold">Selected Values:</h3>
        {selectedValues.wilaya && (
          <div className="flex justify-between">
            <p className="border border-black rounded-xl px-2 py-1">
              Wilaya: {selectedValues.wilaya}
            </p>
            <button
              className="text-red-600"
              onClick={() => removeSelectedValue("wilaya")}
            >
              ✕
            </button>
          </div>
        )}
        {selectedValues.mo3tamdiya && (
          <div className="flex justify-between">
            <p className="border border-black rounded-xl px-2 py-1">
              Mo3tamdiya: {selectedValues.mo3tamdiya}
            </p>
            <button
              className="text-red-600"
              onClick={() => removeSelectedValue("mo3tamdiya")}
            >
              ✕
            </button>
          </div>
        )}
        {prixMin && prixMax && Number(prixMax) > Number(prixMin) && (
          <div className="flex justify-between">
            <p className="border border-black rounded-xl px-2 py-1">
              Prix: {prixMin} - {prixMax} par {prixOption}
            </p>
            <button
              className="text-red-600"
              onClick={() => removePriceValue("prix")}
            >
              ✕
            </button>
          </div>
        )}
        {selectedValues.lchkon && (
          <div className="flex justify-between">
            <p className="border border-black rounded-xl px-2 py-1">
              Pour: {selectedValues.lchkon}
            </p>
            <button
              className="text-red-600"
              onClick={() => removeSelectedValue("lchkon")}
            >
              ✕
            </button>
          </div>
        )}
        {selectedValues.nbrChambres !== null && (
          <div className="flex justify-between">
            <p className="border border-black rounded-xl px-2 py-1">
              nbr de chambres : {selectedValues.nbrChambres}
            </p>
            <button
              className="text-red-600"
              onClick={() => removeSelectedValue("nbrChambres")}
            >
              ✕
            </button>
          </div>
        )}
        {selectedValues.typeDar && (
          <div className="flex justify-between">
            <p className="border border-black rounded-xl px-2 py-1">
              Type: {selectedValues.typeDar}
            </p>
            <button
              className="text-red-600"
              onClick={() => removeSelectedValue("typeDar")}
            >
              ✕
            </button>
          </div>
        )}
      </div>
      <div className="w-4/6 flex flex-col justify-center items-center gap-4 border-x border-b">
        <div className="flex flex-wrap gap-x-4 gap-y-8 justify-center w-4/5 py-8">
          {children}
        </div>
      </div>
      <div className="w-1/6 h-full border p-3">
        {selectedValues.autres.length > 0 && (
          <div>
            <p className="border border-black rounded-xl px-2 py-1">Autres:</p>
            {selectedValues.autres.map((autre) => (
              <div key={autre} className="flex justify-between">
                <p>{autre}</p>
                <button
                  className="text-red-600"
                  onClick={() => removeArrayValue("autres", autre)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderWindowContent = () => {
    switch (openedWindow) {
      case "wilaya":
        return (
          <FilterWrapper>
            {wilayat.map((wilay, index) => (
              <button
                key={wilay}
                className={`px-4 py-2 border rounded-md ${
                  selectedValues.wilaya === wilay
                    ? "border-blue-700 text-blue-700"
                    : "hover:border-black"
                }`}
                onClick={() => {
                  const newWilaya =
                    selectedValues.wilaya === wilay ? "" : wilay; // Toggle selection
                  updateSelectedValues("wilaya", newWilaya);
                  setWilayaIndex(index);
                }}
              >
                {wilay}
              </button>
            ))}
          </FilterWrapper>
        );

      case "mo3tamdiya":
        return (
          <FilterWrapper>
            {!selectedValues.wilaya ? (
              <h1>e5tar lwilaya gbal</h1>
            ) : (
              mo3tamdiyat[wilayaIndex].map((mo3) => (
                <button
                  key={mo3}
                  onClick={() => {
                    const newMo3tamdiya =
                      selectedValues.mo3tamdiya === mo3 ? "" : mo3; // Toggle selection
                    updateSelectedValues("mo3tamdiya", newMo3tamdiya);
                  }}
                  className={`px-4 py-2 border  rounded-md ${
                    selectedValues.mo3tamdiya == mo3
                      ? "border-blue-700 text-blue-700"
                      : "hover:border-black"
                  }`}
                >
                  {mo3}
                </button>
              ))
            )}
          </FilterWrapper>
        );
      case "lchkon dar":
        return (
          <FilterWrapper>
            {chkonList.map((chkonn) => (
              <button
                key={chkonn}
                className={`px-4 py-2 border  rounded-md ${
                  selectedValues.lchkon == chkonn
                    ? "border-blue-700 text-blue-700"
                    : "hover:border-black"
                }`}
                onClick={() => {
                  const newLchkon =
                    selectedValues.lchkon === chkonn ? "" : chkonn; // Toggle selection
                  updateSelectedValues("lchkon", newLchkon);
                }}
              >
                {chkonn}
              </button>
            ))}
          </FilterWrapper>
        );
      case "nbr de chambre":
        return (
          <FilterWrapper>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">nbr de chambres :</span>
              <button
                onClick={decrementCount}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 h-fit w-6 rounded "
              >
                -
              </button>

              <span>{selectedValues.nbrChambres}</span>

              <button
                onClick={incrementCount}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 h-fit w-6 rounded "
              >
                +
              </button>
            </div>
          </FilterWrapper>
        );
      case "type mta3 dar":
        return (
          <FilterWrapper>
            {["apartment", "dar", "studio", "villa"].map((type) => (
              <CustomCheckbox
                key={type}
                label={type}
                checked={selectedValues.typeDar === type}
                onChange={() => {
                  const newTypeDar =
                    selectedValues.typeDar === type ? "" : type; // Toggle selection
                  updateSelectedValues("typeDar", newTypeDar);
                }}
              />
            ))}
          </FilterWrapper>
        );
      case "meublé wla":
        return (
          <FilterWrapper>
            <div className="flex gap-3">
              <h1>meublé :</h1>
              <h1 className="flex items-center">
                oui
                <span
                  className="ml-1 w-5 h-5 border-2 border-gray-400 rounded-sm flex justify-center items-center"
                  onClick={() => updateSelectedValues("meubles", "oui")}
                ></span>
              </h1>
              <h1 className="flex items-center">
                non
                <span
                  className="ml-1 w-5 h-5 border-2 border-gray-400 rounded-sm flex justify-center items-center"
                  onClick={() => updateSelectedValues("meubles", "non")}
                ></span>
              </h1>
            </div>
          </FilterWrapper>
        );
      case "autres":
        return (
          <FilterWrapper>
            {chfamaAkher.map((label) => (
              <CustomCheckbox
                key={label}
                label={label}
                checked={selectedValues.autres.includes(label)}
                onChange={() => {
                  const isSelected = selectedValues.autres.includes(label);
                  const newAutres = isSelected
                    ? selectedValues.autres.filter((item) => item !== label) // Remove if already selected
                    : [...selectedValues.autres, label]; // Add if not selected
                  updateSelectedValues("autres", newAutres);
                }}
              />
            ))}
          </FilterWrapper>
        );
      default:
        return null;
    }
  };
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-5/6 p-6 bg-white rounded-lg shadow-lg h-4/5 flex flex-col justify-between">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={() => setOpen(!open)}
            >
              &times;
            </button>
            <ul className="flex space-x-4 justify-center border-b-2">
              {filters.map((filter) => (
                <li
                  key={filter}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100  ${
                    openedWindow == filter ? "border-b-2 border-black" : ""
                  }`}
                  onClick={() => setWindow(filter)}
                >
                  {filter}
                </li>
              ))}
            </ul>
            {renderWindowContent()}
            {openedWindow == "prix" && (
              <div className="flex h-full ">
                <div className="w-1/6 h-full border flex flex-col gap-2 p-3">
                  <h3 className="font-semibold">Selected Values:</h3>
                  {selectedValues.wilaya && (
                    <div className="flex justify-between">
                      <p className="border border-black rounded-xl px-2 py-1">
                        Wilaya: {selectedValues.wilaya}
                      </p>
                      <button
                        className="text-red-600"
                        onClick={() => removeSelectedValue("wilaya")}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {selectedValues.mo3tamdiya && (
                    <div className="flex justify-between">
                      <p className="border border-black rounded-xl px-2 py-1">
                        Mo3tamdiya: {selectedValues.mo3tamdiya}
                      </p>
                      <button
                        className="text-red-600"
                        onClick={() => removeSelectedValue("mo3tamdiya")}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {prixMin && prixMax && Number(prixMax) > Number(prixMin) && (
                    <div className="flex justify-between">
                      <p className="border border-black rounded-xl px-2 py-1">
                        Prix: {prixMin} - {prixMax} par {prixOption}
                      </p>
                      <button
                        className="text-red-600"
                        onClick={() => removePriceValue("prix")}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {selectedValues.lchkon && (
                    <div className="flex justify-between">
                      <p className="border border-black rounded-xl px-2 py-1">
                        Pour: {selectedValues.lchkon}
                      </p>
                      <button
                        className="text-red-600"
                        onClick={() => removeSelectedValue("lchkon")}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {selectedValues.nbrChambres !== null && (
                    <div className="flex justify-between">
                      <p className="border border-black rounded-xl px-2 py-1">
                        nbr de chambres : {selectedValues.nbrChambres}
                      </p>
                      <button
                        className="text-red-600"
                        onClick={() => removeSelectedValue("nbrChambres")}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {selectedValues.typeDar && (
                    <div className="flex justify-between">
                      <p className="border border-black rounded-xl px-2 py-1">
                        Type: {selectedValues.typeDar}
                      </p>
                      <button
                        className="text-red-600"
                        onClick={() => removeSelectedValue("typeDar")}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <div className="w-4/6 flex flex-col justify-center items-center gap-4 border-x border-b">
                  <div className="flex flex-wrap gap-x-4 gap-y-8 justify-center w-4/5 py-8">
                    <input
                      className="block border px-4 py-2 w-32 rounded-lg no-arrows"
                      type="number"
                      placeholder="min"
                      value={prixMin}
                      required
                      onChange={(e) => setPrixMin(e.target.value)}
                    />
                    <input
                      className="block border px-4 py-2 w-32 rounded-lg no-arrows"
                      type="number"
                      placeholder="max"
                      value={prixMax}
                      required
                      onChange={(e) => setPrixMax(e.target.value)}
                    />
                    <div className="relative inline-block text-left">
                      <div
                        className="flex items-center px-4 border cursor-pointer"
                        onClick={toggleDropdown}
                      >
                        <button className="  text-[#6D6D6D]  px-4 py-2">
                          {prixOption}
                        </button>
                        <a>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </a>
                      </div>
                      {isOpen && (
                        <div className="absolute right-0 z-10 w-full mt-2 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            {/* Dropdown options */}
                            <button
                              onClick={() => handleOptionClick("moins")}
                              className="block px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              moins
                            </button>
                            <button
                              onClick={() => handleOptionClick("jours")}
                              className="block px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              jours
                            </button>
                            <button
                              onClick={() => handleOptionClick("semaines")}
                              className="block px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              semaines
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-1/6 h-full border  p-3">
                  {selectedValues.autres.length > 0 && (
                    <div>
                      <p className="border border-black rounded-xl px-2 py-1">
                        Autres:
                      </p>
                      {selectedValues.autres.map((autre) => (
                        <div key={autre} className="flex justify-between">
                          <p>{autre}</p>
                          <button
                            className="text-red-600"
                            onClick={() => removeArrayValue("autres", autre)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-between w-full">
              <button
                className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={() => setOpen(!open)}
              >
                Close
              </button>
              <button className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              onClick={()=>handleSearch()}>
                rechercher
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OpenedFilter;
