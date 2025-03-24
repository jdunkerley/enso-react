import Grouping, { getGrouping, DEFAULT } from "./Grouping"
import functionGroupings from "./FunctionGrouping.json"

export default class FunctionGrouping {
    namespace: string
    type: string
    name: string
    accessor: string
    grouping: Grouping

    constructor(namespace: string, type: string, name: string, accessor: string, grouping: Grouping) {
        this.namespace = namespace
        this.type = type
        this.name = name
        this.accessor = accessor
        this.grouping = grouping
    }

    static getGrouping(namespace: string, type: string, name: string): FunctionGrouping {
        return FUNCTION_GROUPINGS.find((functionGrouping: FunctionGrouping) => {
            return functionGrouping.namespace === namespace && functionGrouping.type === type && functionGrouping.name === name
        }) || new FunctionGrouping("", "", "", "", DEFAULT)
    }
}

export const FUNCTION_GROUPINGS: FunctionGrouping[] = functionGroupings.map((functionGrouping: any) => {
    return new FunctionGrouping(
        functionGrouping.module,
        functionGrouping.type,
        functionGrouping.name,
        functionGrouping.accessor,
        getGrouping(functionGrouping.group)
    )
})
