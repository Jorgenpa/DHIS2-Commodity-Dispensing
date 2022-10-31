
// The data query to GET dataValueSets and dataSets for our hospital
export function fetchHospitalData() {
    return {
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
}