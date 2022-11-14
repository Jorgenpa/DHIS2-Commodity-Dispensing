
// The data query to GET dataValueSets and dataSets for our hospital
export function fetchHospitalData() {
    return {
        dataValueSets: {
            resource: "/dataValueSets",
            params: ({ orgUnit, period }) => ({
                orgUnit: orgUnit,
                period: period,
                dataSet: "ULowA8V3ucd"
            })
        },
        dataSets: {
            resource: "/dataSets",
            params: {
                dataSetId: "ULowA8V3ucd",
                fields: "name,id,dataSetElements[dataElement[name,id,created,categoryCombo[name,id]]]",
                filter: "name:eq:Life-Saving Commodities"
            }
        }
    }
}


// The data query to find the health facilities nearby 
export function fetchNeighbors() {
    return {
        orgUnits: {
            resource: "/organisationUnits/aWQTfvgPA5v",
            params: {
              fields: "children[displayName,id]"
            }
          }
    }
}

// The data query to deposit a transaction
export function deposit() {
    return {
        resource:"dataValueSets",
        dataSet: "ULowA8V3ucd",
        type: "create",
        data: ({dataElement, value, categoryOptionCombo}) => ( {
            orgUnit: "MnfykVk3zin",
            period: "202110",
            dataValues: [
                {
                dataElement: dataElement,
                categoryOptionCombo: categoryOptionCombo,
                value: value,
                },
            ],
        }),
    }
 }



//test fetchDataStoreDataQuery()
export function fetchDataStoreTransactions(){
    return {
        dispensingDataStoreData: {
            resource: "dataStore/IN5320-G19/DispensingHistory"
        }
    }
}
  
// fetchDataStoreMutationQuery
export function fetchDataStoreMutation(){
    return({
        resource: "dataStore/IN5320-G19/DispensingHistory",
        type: "update",
        data: (dispensingHistory) => dispensingHistory
    })
}