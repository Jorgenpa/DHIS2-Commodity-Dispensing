import { useDataQuery } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"
import React, { useState } from 'react';
import {
    DataTable,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableBody,
    DataTableRow,
    TableRowHead,
} from '@dhis2/ui'

import { fetchHospitalData, fetchNeighbors } from "./DataQueries";

// Fungerer ikke enda :( 

// Retrieves data from the API and lets the user choose which health facility to look at
export function NeighborOverview(props) {
    const { loading, error, data } = useDataQuery(fetchNeighbors())

    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large />
    }

    if (data) {
        console.log(data);
        const facilities = []

        data?.orgUnits?.children?.map((facility) => {
            if (facility.id !== "MnfykVk3zin") 
                facilities.push({name: facility.displayName, id: facility.id})
        })
        
        console.log(facilities)

        /*
        let array = []
        data?.dataSets?.dataSets[0]?.dataSetElements?.map(dataValue =>
            array.push({
                "id": dataValue.dataElement.id,
                "name": dataValue.dataElement.name.split("-")[1].trim()
            })
        );
        data?.dataValueSets?.dataValues?.map(dataValue => {
            array.map(arrValue => {
                if (arrValue.id == dataValue.dataElement) {
                    if (dataValue.categoryOptionCombo == "rQLFnNXXIL0")
                        arrValue.end = dataValue.value
                }
            })
        })
        */
        return (
            <>
                <DataTable>
                    <DataTableHead>
                        <TableRowHead>
                            <DataTableColumnHeader>Commodity</DataTableColumnHeader>
                            <DataTableColumnHeader>In stock</DataTableColumnHeader>
                        </TableRowHead>
                    </DataTableHead>
                    <DataTableBody>
                        {array?.map((dataValue, index) =>
                            <DataTableRow key={index}>
                                <DataTableCell>{dataValue.name}</DataTableCell>
                                <DataTableCell>{dataValue.end}</DataTableCell>
                            </DataTableRow>
                        )}
                    </DataTableBody>
                </DataTable>
            </>
        )
        
    }
}