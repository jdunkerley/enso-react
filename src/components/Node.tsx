import React from 'react'
import './Node.css'

type NodeProps = {
}

const Node = (props: React.PropsWithChildren<NodeProps>) => {

    return (
        <div className="nodeDiv">
            {props.children}
        </div>
    )
}

export default Node
