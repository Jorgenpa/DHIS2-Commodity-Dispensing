import React from "react";
import { Menu, MenuItem, MenuDivider } from "@dhis2/ui";

export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        label="Overview/Replenish"
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
      <MenuItem
        label="Transaction Log"
        active={props.activePage =="TransactionLog"}
        onClick={() => props.activePageHandler("TransactionLog")}
      />
      <MenuDivider />
      <MenuItem
        label="Data Elements"
        active={props.activePage == "DataElements"}
        onClick={() => props.activePageHandler("DataElements")}
      />
    </Menu>
  );
}
