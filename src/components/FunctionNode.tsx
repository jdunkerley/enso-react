import React from 'react'
import './Node.css'
import Function, { FunctionType } from '../data/Function'

type FunctionNodeProps = {
    function: Function,
    search: string
}

const FunctionNode = (props: React.PropsWithChildren<FunctionNodeProps>) => {
    const typeName = props.function.functionType === FunctionType.Static ? '' : '.' + props.function.type
    const title = props.function.namespace + typeName + ' :: ' + props.function.name + ' (' + props.function.functionType + ' - ' + props.function.getGrouping().name + ': ' + props.function.getSearch(props.search) + (props.function.suggested ? '- SUGGESTED: ' + props.function.suggested : '') + ')'
    return (
        <div className="nodeDiv" style={{ backgroundColor: props.function.getGrouping().color, display: 'table', margin: '2px' }} title={title}>
            {props.function.getDisplayText(props.search)}
        </div>
    )
}

export default FunctionNode
