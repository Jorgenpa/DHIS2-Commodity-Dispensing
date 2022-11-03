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
    DataTableToolbar, 
    Field,
} from '@dhis2/ui'

import { fetchHospitalData } from "./DataQueries";


// Retrieves data from the API and creates a table with it
export function Overview(props) {
    const { loading, error, data } = useDataQuery(fetchHospitalData(), {
        variables: {
            orgUnit: props.fd.orgUnit,
            period: props.fd.period,
        }
    })

    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large />
    }

    if (data) {
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
                <DataTableToolbar>
                    <Field label=<b>{props.fd.displayName}</b> ></Field>
                </DataTableToolbar>
                <DataTable>
                    <DataTableHead>
                        <TableRowHead>
                            <DataTableColumnHeader>Commodity</DataTableColumnHeader>
                            <DataTableColumnHeader>Consumption</DataTableColumnHeader>
                            <DataTableColumnHeader>End balance</DataTableColumnHeader>
                            <DataTableColumnHeader>Quantity to be ordered</DataTableColumnHeader>
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