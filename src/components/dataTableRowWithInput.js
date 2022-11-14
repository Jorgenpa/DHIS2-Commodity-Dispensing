import {
    DataTableCell,
    DataTableRow,
    Input
} from '@dhis2/ui'
import { useState, useEffect } from 'react';

const DataTableRowWithInput = ({ dataValue, replenish }) => {
    const [inputValue, setInputValue] = useState()

    const handleInput = (evt) => {
        setInputValue(evt.value)
    }

    useEffect(() => {
        console.log(`------------------------------------------------`);
        console.log(`Ordering: ${parseInt(inputValue)} of ${dataValue.name}`);
        console.log(`Total to order: ${parseInt(dataValue.qua) + parseInt(inputValue)}`)
        console.log(`Total consumption: ${parseInt(dataValue.con) + parseInt(inputValue)}`)
        console.log(`Total endbalance: ${parseInt(dataValue.end) - parseInt(inputValue)}`)
        console.log(`------------------------------------------------`);
    }, [inputValue])

    return (
        <DataTableRow>
            <DataTableCell>{dataValue.name}</DataTableCell>
            <DataTableCell>{dataValue.con}</DataTableCell>
            <DataTableCell>{dataValue.end}</DataTableCell>
            <DataTableCell>{dataValue.qua}</DataTableCell>
            {replenish &&
                <DataTableCell>
                    <Input name={`value_${dataValue.id}`} onChange={handleInput} />
                </DataTableCell>
            }
        </DataTableRow>
    )
}

export default DataTableRowWithInput