import React from "react";
import classes from "./App.module.css";
import { useState } from "react";

import { Browse } from "./Browse";
import { Insert } from "./Insert";
import { Navigation } from "./Navigation";
import Datasets from "./Datasets";
import { Test } from "./Test";

function MyApp() {
  const [activePage, setActivePage] = useState("Test");

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
        {activePage === "Test" && <Test />}
      </div>
    </div>
  );
}

export default MyApp;