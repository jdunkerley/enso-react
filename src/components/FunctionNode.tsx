import React from 'react'
import './Node.css'
import Function from '../data/Function'

type FunctionNodeProps = {
    function: Function
}

const FunctionNode = (props: React.PropsWithChildren<FunctionNodeProps>) => {

    return (
        <div className="nodeDiv" style={{ backgroundColor: props.function.getGrouping().color }} title={props.function.namespace + '.' + props.function.type + ' (' + props.function.functionType + ')'}>
            {props.function.name}
        </div>
    )
}

export default FunctionNode
