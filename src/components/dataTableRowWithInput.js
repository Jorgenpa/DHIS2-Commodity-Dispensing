import {
    DataTableCell,
    DataTableRow,
    Input
} from '@dhis2/ui'
import { useState, useEffect } from 'react';

const DataTableRowWithInput = ({ dataValue, replenish, handleInput }) => {
    const [inputValue, setInputValue] = useState()
    const [totalConsumption, setTotalConsumption] = useState()
    const [newEndBalance, setNewEndBalance] = useState()

    const updateInput = (evt) => {
        setTotalConsumption(parseInt(dataValue.con) + parseInt(evt.value))
        setNewEndBalance(parseInt(dataValue.end) - parseInt(evt.value))
        setInputValue(evt.value)
    }

    useEffect(() => {
        handleInput(dataValue.id, {
            id: dataValue.id,
            name: dataValue.name,
            con: totalConsumption,
            end: newEndBalance,
            qua: dataValue.qua,
            values: inputValue,
        })
    }, [inputValue])

    return (
        <DataTableRow>
            <DataTableCell>{dataValue.name}</DataTableCell>
            <DataTableCell>{dataValue.con}</DataTableCell>
            <DataTableCell>{dataValue.end}</DataTableCell>
            <DataTableCell>{dataValue.qua}</DataTableCell>
            {replenish &&
                <DataTableCell>
                    <Input name={`value_${dataValue.id}`} onChange={updateInput} />
                </DataTableCell>
            }
        </DataTableRow>
    )
}

export default DataTableRowWithInput