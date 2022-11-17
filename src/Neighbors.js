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
    DropdownButton,
    FlyoutMenu,
    MenuItem,
} from '@dhis2/ui'

import { fetchHospitalData } from "./DataQueries";


// Retrieves data from the API and lets the user choose which health facility to look at
export function NeighborOverview(props) {
    const [orgUnit, setOrgUnit] = useState(props.neighbors[0].id)
    const [name, setName] = useState(props.neighbors[0].name)

    const { loading, error, data, refetch } = useDataQuery(fetchHospitalData(), {
        variables: {
            orgUnit: orgUnit,
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
                    if (dataValue.categoryOptionCombo == "rQLFnNXXIL0")
                        arrValue.end = dataValue.value
                }
            })
        })

        const handleChange = (evt) => {
            const id = evt.value.split("_")[0]
            const name = evt.value.split("_")[1]
            setOrgUnit(id)
            setName(name)
            refetch({ orgUnit: id })
        }

        return (
            <>
                <DropdownButton
                    name="neighborButtonName"
                    component={
                        <FlyoutMenu>
                            {props.neighbors.map((neighbor, index) => (
                                <MenuItem label={neighbor.name} key={index} value={`${neighbor.id}_${neighbor.name}`} onClick={handleChange} />
                            ))}
                        </FlyoutMenu>
                    }
                >
                    Select Hospital
                </DropdownButton>

                <DataTableToolbar>
                    <strong><Field label={name}></Field></strong>
                </DataTableToolbar>
                <DataTable>
                    <DataTableHead>
                        <TableRowHead>
                            <DataTableColumnHeader>Commodity</DataTableColumnHeader>
                            <DataTableColumnHeader>In Stock</DataTableColumnHeader>
                        </TableRowHead>
                    </DataTableHead>
                    <DataTableBody>
                        {array?.sort((a,b) => a.name > b.name ? 1 : -1).map((dataValue, index) =>
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