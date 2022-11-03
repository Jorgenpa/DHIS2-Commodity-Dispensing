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
        return (

            // Det under fungerer ikke  
            <>
                <DropdownButton
                    name="neighborButtonName"
                    //value="neighborButtonValue"
                    
                    component={
                        <FlyoutMenu
                            selectedOrgUnit={orgUnit}
                            selectedName={name}
                            onChange={(dataValue) => {
                                setOrgUnit(dataValue.selectedOrgUnit)
                                setName(dataValue.selectedName)
                                console.log(orgUnit)
                                console.log(dataValue.selectedOrgUnit)
                                refetch({ orgUnit: dataValue.selectedOrgUnit })
                            }}
                        >
                            {props.neighbors.map((neighbor, index) => (
                                <MenuItem label={neighbor.name} key={index} value={neighbor.id} />
                            ))}
                        </FlyoutMenu>
                    }
                >
                    Select Hospital
                </DropdownButton>

                <DataTableToolbar>
                    <Field label=<b>{name}</b> ></Field>
                </DataTableToolbar>
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