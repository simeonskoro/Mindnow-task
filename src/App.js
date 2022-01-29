import { Routes, Route, useParams } from "react-router-dom";

import rootStore from "./Stores";
import { Results, SearchBar, BreweryPage } from "./Components";

import "./App.scss";

const App = () => {
  const params = useParams();

  const { favorizedBreweries: breweries, toggleFavorite } =
    rootStore.breweriesStore;

  return (
    <div id="App">
      <SearchBar
        // Checking the params to move the search bar to the top of the screen.
        className={params["*"] && params["*"] !== "search" ? "top" : null}
        breweries={breweries}
        toggleFavorite={toggleFavorite}
      />
      {/* Using the same component for results and favorites to save development time,
        since it is limited. Wouldn't do this in the real project. */}
      <Routes>
        <Route
          path="/favorites"
          element={
            <Results breweries={breweries} toggleFavorite={toggleFavorite} />
          }
        />
        <Route
          path="/results"
          element={
            <Results breweries={breweries} toggleFavorite={toggleFavorite} />
          }
        />
        <Route
          path="/*"
          element={
            <BreweryPage
              breweries={breweries}
              toggleFavorite={toggleFavorite}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
