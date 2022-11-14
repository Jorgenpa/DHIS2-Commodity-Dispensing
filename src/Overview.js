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
    Input
} from '@dhis2/ui'

import { fetchHospitalData } from "./DataQueries";
import DataTableRowWithInput from "./components/dataTableRowWithInput";


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

        const handleInput = () => {

        }

        return (
            <>
                <DataTableToolbar>
                    <Field label={props.fd.displayName}></Field>
                </DataTableToolbar>
                <DataTable>
                    <DataTableHead>
                        <TableRowHead>
                            <DataTableColumnHeader>Commodity</DataTableColumnHeader>
                            <DataTableColumnHeader>Consumption</DataTableColumnHeader>
                            <DataTableColumnHeader>End balance</DataTableColumnHeader>
                            <DataTableColumnHeader>Quantity to be ordered</DataTableColumnHeader>
                            <DataTableColumnHeader>Quantity</DataTableColumnHeader>
                        </TableRowHead>
                    </DataTableHead>
                    <DataTableBody>
                        {array?.map((dataValue, index) =>
                            <DataTableRowWithInput key={index} dataValue={dataValue} />
                        )}
                    </DataTableBody>
                </DataTable>
            </>
        )
    }
}