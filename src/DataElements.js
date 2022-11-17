import { useDataQuery, useDataMutation } from "@dhis2/app-runtime"
import { CircularLoader, Menu, MenuItem } from "@dhis2/ui"
import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableHead,
    DataTableRow,
    TableRowHead,
    TableCellHead,
    DataTableToolbar,
    Field,
} from '@dhis2/ui'
import React, { useState } from "react"

import classes from "./App.module.css";
import { fetchHospitalData } from "./DataQueries";


// Retrieves data from the API and presents information about the different commodities
export function DataElements(props) {  
    const { loading, error, data } = useDataQuery(fetchHospitalData(), {
        variables: {
            orgUnit: props.fd.orgUnit,
            period: props.fd.period,
        }
    })
    const [currentDataset, setCurrentDataset] = useState()

    const showDetails = (e) => {
        console.log(e.value);
        if (JSON.parse(e.value)?.id === currentDataset?.id)
            setCurrentDataset()
        else
            setCurrentDataset(JSON.parse(e.value))
    }

    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large />
    }

    if (data) {

        let array = []
        const dataSetName = data?.dataSets?.dataSets[0]?.name
        data?.dataSets?.dataSets[0]?.dataSetElements?.map(dataValue =>
            array.push({
                "id": dataValue.dataElement.id,
                "name": dataValue.dataElement.name.split("-")[1].trim(),
                "created": dataValue.dataElement.created
            })
        );

        return (
            <div>
                <Menu>
                    <DataTableToolbar style={{ border: "solid gray 1px", background:"lightgray" }} >
                        <strong><Field label={ dataSetName }></Field></strong>
                    </DataTableToolbar>
                    {array?.sort((a,b) => a.name > b.name ? 1 : -1).map(dataset =>
                        <MenuItem className={classes.menuitem} key={dataset.id} label={dataset.name} onClick={showDetails} value={JSON.stringify(dataset)} />
                    )}
                </Menu>
                {currentDataset &&
                    <DataTable>
                        <DataTableHead style={{ background:"lightgray" }} >
                            <TableRowHead>
                                <TableCellHead>
                                    ID
                                </TableCellHead>
                                <TableCellHead>
                                    Display name
                                </TableCellHead>
                                <TableCellHead>
                                    Creation date
                                </TableCellHead>
                            </TableRowHead>
                        </DataTableHead>
                        <DataTableBody>
                            <DataTableRow>
                                <DataTableCell>
                                    {currentDataset?.id}
                                </DataTableCell>
                                <DataTableCell>
                                    {currentDataset?.name}
                                </DataTableCell>
                                <DataTableCell>
                                    {currentDataset?.created}
                                </DataTableCell>
                            </DataTableRow>
                        </DataTableBody>
                    </DataTable>
                }
            </div>
        )
        
    }
}