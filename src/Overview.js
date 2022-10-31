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

import { fetchHospitalData } from "./DataQueries";


// Retrieves data from the API and creates a table with it
export function Overview(props) {
    const { loading, error, data } = useDataQuery(fetchHospitalData())
    const [values, setValues] = useState([])

    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large />
    }

    if (data) {
        console.log(data);
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
                    if (dataValue.categoryOptionCombo == "J2Qf1jtZuj8")
                        arrValue.con = dataValue.value
                    else if (dataValue.categoryOptionCombo == "rQLFnNXXIL0")
                        arrValue.end = dataValue.value
                    else if (dataValue.categoryOptionCombo == "KPP63zJPkOu")
                        arrValue.qua = dataValue.value
                }
            })
        })
        return (
            <>
                <DataTable>
                    <DataTableHead>
                        <TableRowHead>
                            <DataTableColumnHeader></DataTableColumnHeader>
                            <DataTableColumnHeader>Consumption</DataTableColumnHeader>
                            <DataTableColumnHeader>End balance</DataTableColumnHeader>
                            <DataTableColumnHeader>Quantity to be ordered</DataTableColumnHeader>
                        </TableRowHead>
                        <TableRowHead>
                            <DataTableColumnHeader>Commodity</DataTableColumnHeader>
                            <DataTableColumnHeader>A</DataTableColumnHeader>
                            <DataTableColumnHeader>B</DataTableColumnHeader>
                            <DataTableColumnHeader>C</DataTableColumnHeader>
                        </TableRowHead>
                    </DataTableHead>
                    <DataTableBody>
                        {array?.map((dataValue, index) =>
                            <DataTableRow key={index}>
                                <DataTableCell>{dataValue.name}</DataTableCell>
                                <DataTableCell>{dataValue.con}</DataTableCell>
                                <DataTableCell>{dataValue.end}</DataTableCell>
                                <DataTableCell>{dataValue.qua}</DataTableCell>
                            </DataTableRow>
                        )}
                    </DataTableBody>
                </DataTable>
            </>
        )
    }
}