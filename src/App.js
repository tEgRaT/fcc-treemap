import React from 'react';
import './App.css';
import Treemap from './components/Treemap';
// import TreeMap from 'react-d3-treemap';
// import 'react-d3-treemap/dist/react.d3.treemap.css';

// https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json
// https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json
// https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json

// const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';
const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';

function App() {
  return (
    <div className="App">
      <h1 id="title">Video Game Sales</h1>
      <h3 id="description">Top 100 Most Sold Video Games Grouped by Platform</h3>
      {/* <TreeMap
        height={500}
        width={800}
        data={data}
        // valueUnit={"MB"}
        className="tile"
      /> */}
      <div id="legend"></div>
      <Treemap width={800} height={500} url={url} />
    </div>
  );
}

export default App;
