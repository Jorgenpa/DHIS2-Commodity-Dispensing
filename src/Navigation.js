import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";

export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        label="Browse"
        active={props.activePage == "Browse"}
        onClick={() => props.activePageHandler("Browse")}
      />
      <MenuItem
        label="Insert"
        active={props.activePage == "Insert"}
        onClick={() => props.activePageHandler("Insert")}
      />
      <MenuItem
        label="Datasets"
        active={props.activePage == "Datasets"}
        onClick={() => props.activePageHandler("Datasets")}
      />
      <MenuItem
        label="Overview"
        active={props.activePage == "Overview"}
        onClick={() => props.activePageHandler("Overview")}
      />
      <MenuItem
        label="Overview Neighbors"
        active={props.activePage == "Neighbors"}
        onClick={() => props.activePageHandler("Neighbors")}
      />
      <MenuItem
        label="Dispensing"
        active={props.activePage == "Dispense"}
        onClick={() => props.activePageHandler("Dispense")}
      />
    </Menu>
  );
}
