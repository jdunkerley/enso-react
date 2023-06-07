import React from 'react'
import './Node.css'

type NodeProps = {
    code: string
    level?: number
}

const Node = (props: React.PropsWithChildren<NodeProps>) => {

    return (
        <div className="nodeDiv">
            {props.code} {props.children}
        </div>
    )
}

export default Node
