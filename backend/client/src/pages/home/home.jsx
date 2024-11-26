import SearchZone from "../../components/SearchZone";
import Filters from "../../components/Filters";
import ListOfHouses from "../house/ListOfHouses";
import ListOfResults from "../house/ListOfResults";
import { SearchProvider,SearchContext } from "../../SearchProvider";
import { useContext } from "react";

function App() {
  return (
    <div>
      <SearchProvider>
        <SearchZone />
        <Filters />
        <MainContent/>
      </SearchProvider>
      {/*<OpenedFilter/>*/}
    </div>
  );
}
const MainContent = () => {
  const { results } = useContext(SearchContext);

  return (
      <div>
          {results.length === 0 ? <ListOfHouses /> : <ListOfResults />}
      </div>
  );
};

export default App;
