import { useDataQuery } from "@dhis2/app-runtime"
import { CircularLoader, Menu, MenuItem } from "@dhis2/ui"
import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableFoot,
    TableHead,
    TableRow,
    TableRowHead,
} from '@dhis2/ui'
import React, { useState } from "react"

const dataQuery = {
    dataSets: {
        resource: 'dataSets',
        params: {
            fields: [
                'id',
                'displayName',
                'created',
            ],
            paging: "false"
        },
    }
}

const Datasets = () => {
    const { loading, error, data } = useDataQuery(dataQuery)
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
        return (
            <div>
                <Menu>
                    {data?.dataSets?.dataSets?.map(dataset =>
                        <MenuItem key={dataset.id} label={dataset.displayName} onClick={showDetails} value={JSON.stringify(dataset)} />
                    )}
                </Menu>
                {currentDataset &&
                    <Table>
                        <TableHead>
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
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    {currentDataset?.id}
                                </TableCell>
                                <TableCell>
                                    {currentDataset?.displayName}
                                </TableCell>
                                <TableCell>
                                    {currentDataset?.created}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                }
            </div>
        )
    }
}

export default Datasets