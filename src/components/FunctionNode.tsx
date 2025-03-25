import React from 'react'
import './Node.css'
import Function, { FunctionType } from '../data/Function'
import SvgIcon from './SvgIcon'

type FunctionNodeProps = {
    function: Function,
    search: string,
    onClick?: () => void,
    onDoubleClick?: () => void
}

const FunctionNode = (props: React.PropsWithChildren<FunctionNodeProps>) => {
    const typeName = props.function.functionType === FunctionType.Static ? '' : '.' + props.function.type
    const title = props.function.namespace + typeName + ' :: ' + props.function.name + ' (' + props.function.functionType + ' - ' + props.function.grouping.name + ': ' + props.function.getSearch(props.search) + (props.function.suggested ? '- SUGGESTED: ' + props.function.suggested : '') + ')'

    const style: React.CSSProperties = { display: 'table', margin: '2px', backgroundColor: props.function.grouping.color, borderColor: props.function.grouping.color, borderWidth: '1px', borderStyle: 'solid' }
    if (props.function.suggested) {
        style.opacity = 1
    } else if (props.function.isPublic) {
        style.opacity = 0.6
    } else {
        style.color = '#333333'
        style.backgroundColor = '#eeeeee'
        style.opacity = 0.6
    }
    return (
        <div className="nodeDiv" style={{ ...style }} title={title} onClick={() => props.onClick && props.onClick()} onDoubleClick={() => props.onDoubleClick && props.onDoubleClick()}>
            {props.function.icon && (<SvgIcon name={props.function.icon} />) }
            {props.function.getDisplayText(props.search)}
        </div>
    )
}

export default FunctionNode
