import React, { useState } from "react";
import axios from "axios";

const SearchContext = React.createContext();

const SearchProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    wilaya: "",
    mo3tamdiya: "",
    lchkon: "",
  });
  const [filtersv2, setFiltersv2] = useState({
    wilaya: "",
    mo3tamdiya: "",
    lchkon: "",
  });
  const [results, setResults] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const searchHouses = async (searchFilters) => {
    setFilters(searchFilters);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/houses-filter",
        searchFilters
      );
      setResults(response.data);
      if(response.data.length==0){
        setShowToast(true);
      }
      
      
    } catch (err) {
      console.error(err);
    }
  };
  const searchHousesv2 = async (searchFilters) => {
    setFiltersv2(searchFilters);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/houses-multiple-filter",
        searchFilters
      );
      setResults(response.data);
      if(response.data.length==0){
        setShowToast(true);
      }
      
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SearchContext.Provider value={{ filters,filtersv2, results,showToast,setResults,setShowToast, searchHouses,searchHousesv2 }}>
      {children}
    </SearchContext.Provider>
  );
};

export { SearchProvider, SearchContext };
