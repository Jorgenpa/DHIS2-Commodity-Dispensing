import { useDataQuery } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"
import React from 'react';
import { useState, useEffect } from 'react';
import {
    DataTable,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableBody,
    DataTableRow,
    TableRowHead,
    DataTableToolbar,
    Field,
    Button,
    TabBar,
    Tab,
} from '@dhis2/ui'

import { getStore } from "./DataQueries";

export function TransactionLog(props) {
  const { data, error, loading} = useDataQuery(getStore());
  
  if (error) {
    return <span>ERROR: {error.message}</span>
  }

  if (loading) {
    return <CircularLoader large />
  }

  if (data) {

    return (
      <>
    <TabBar id="dsfsf">
      <Tab disabled id="dispensing" onClick={() => {props.handleClick(event)}}>Dispensing</Tab>

      <Tab id="restock" onClick={() => {props.handleClick(event)}}>Restock</Tab>
    </TabBar>
    <DataTable>
      <DataTableHead>
        <DataTableColumnHeader>A</DataTableColumnHeader>
      </DataTableHead>
      <DataTableBody>
        <DataTableCell>B</DataTableCell>
      </DataTableBody>
    </DataTable>
    </>
    )
    }


  /*
  useEffect(() => {
    refetch({
      key: tabIsSelected
    })
  }, [tabIsSelected])
  */
    /*
  if (tabIsSelected == "dispensing") {
    return(
    <>
    <TabBar id="dsfsf">
      <Tab key="dispensing" onClick={() => {handleClick()}}>Dispensing</Tab>

      <Tab key="restock" onClick={() => {handleClick()}}>Restock</Tab>
    </TabBar>
    <Button>Hello</Button>
    </>
    )
  } 
  else {
    return(
      <TabBar>
      <Tab id="dispensing" onClick={() => {handleClick()}}>Dispensing</Tab>

      <Tab id="restock" onClick={() => {handleClick()}}>Restock</Tab>
      </TabBar>
    )
  }
  */
}