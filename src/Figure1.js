import { useDataQuery } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"
import React, { useState } from 'react';
import {
    DataTable,
    Table,
    TableBody,
    DataTableCell,
    DataTableColumnHeader,
    TableFoot,
    TableHead,
    DataTableRow,
    TableRowHead,
} from '@dhis2/ui'

const dataQuery = {
    dataValueSets: {
        resource: "/dataValueSets",
        params: {
            orgUnit: "MnfykVk3zin",
            period: "202110",
            dataSet: "ULowA8V3ucd"
        }
    },
    dataSets: {
        resource: "/dataSets",
        params: {
            dataSetId: "ULowA8V3ucd",
            fields: "name,id,dataSetElements[dataElement[name,id,categoryCombo[name,id]]]",
            filter: "name:eq:Life-Saving Commodities"
        }
    }
}
export function Figure1(props) {
    const { loading, error, data } = useDataQuery(dataQuery)
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
                    <TableHead>
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
                    </TableHead>
                    <TableBody>
                        {array?.map((dataValue, index) =>
                            <DataTableRow key={index}>
                                <DataTableCell>{dataValue.name}</DataTableCell>
                                <DataTableCell>{dataValue.con}</DataTableCell>
                                <DataTableCell>{dataValue.end}</DataTableCell>
                                <DataTableCell>{dataValue.qua}</DataTableCell>
                            </DataTableRow>
                        )}
                    </TableBody>
                </DataTable>
            </>
        )
    }
}