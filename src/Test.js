import { useDataQuery } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"
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

const dataQuery = {
    dataSets: {
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
            orgUnit: "MnfykVk3zin",
            fields: "dataSetElements[dataElement[name,id,categoryCombo[categoryOptionCombos[name,id]],dataElementGroups[name, id]]]"
        }
    }
}
export function Test(props) {
    const { loading, error, data } = useDataQuery(dataQuery)
    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large />
    }

    if (data) {
        console.log(data);

        /* const consumption = data?.dataSets?.dataValues.filter(dataValue => dataValue.categoryOptionCombo == "J2Qf1jtZuj8");
        const endBalance = data?.dataSets?.dataValues.filter(dataValue => dataValue.categoryOptionCombo == "rQLFnNXXIL0");
        const qtbo = data?.dataSets?.dataValues.filter(dataValue => dataValue.categoryOptionCombo == "KPP63zJPkOu"); */
        //console.log(consumption, endBalance, qtbo);
        return (
            <>
                {/* <div>
                {data?.dataSets?.dataValues?.map((dataValue, index) =>
                    <p key={index}>{`${dataValue.dataElement} - ${dataValue.value}`}</p>
                )}
            </div> */}
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead></TableCellHead>
                            <TableCellHead>Consumption</TableCellHead>
                            <TableCellHead>End balance</TableCellHead>
                            <TableCellHead>Quantity to be ordered</TableCellHead>
                        </TableRowHead>
                        <TableRowHead>
                            <TableCellHead>Commodity</TableCellHead>
                            <TableCellHead>A</TableCellHead>
                            <TableCellHead>B</TableCellHead>
                            <TableCellHead>C</TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {data?.dataSets?.dataValues?.map((dataValue, index) =>
                            <TableRow key={index}>
                                <TableCell>{dataValue.dataElement}</TableCell>
                                <TableCell>{dataValue.value}</TableCell>
                                <TableCell>{dataValue.value}</TableCell>
                                <TableCell>{dataValue.value}</TableCell>
                            </TableRow>
                        )}
                        {/* {mergedData.map(row => {
                            return (
                                <TableRow key={row.id}>
                                    <TableCell>{row.displayName}</TableCell>
                                    <TableCell>{row.value}</TableCell>
                                    <TableCell>{row.id}</TableCell>
                                </TableRow>
                            )
                        })} */}
                    </TableBody>
                </Table>
            </>
        )
    }
}