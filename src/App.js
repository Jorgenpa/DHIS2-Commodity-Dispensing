import React from "react";
import classes from "./App.module.css";
import { useState } from "react";

import { Browse } from "./Browse";
import { Insert } from "./Insert";
import { Navigation } from "./Navigation";
import Datasets from "./Datasets";
import { Figure1 } from "./Figure1";

function MyApp() {
  const [activePage, setActivePage] = useState("Figure1");

  function activePageHandler(page) {
    setActivePage(page);
  }

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Navigation
          activePage={activePage}
          activePageHandler={activePageHandler}
        />
      </div>
      <div className={classes.right}>
        {activePage === "Browse" && <Browse />}
        {activePage === "Insert" && <Insert />}
        {activePage === "Datasets" && <Datasets />}
        {activePage === "Figure1" && <Figure1 />}
      </div>
    </div>
  );
}

export default MyApp;