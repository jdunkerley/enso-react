import React from 'react'
import icons from './icons.svg'
import './SvgIcon.css'

type SvgIconProps = {
    name: string
}

const SvgIcon = (props: React.PropsWithChildren<SvgIconProps>) => {
    return (
      <svg className="SvgIcon" viewBox="0 0 16 16" preserveAspectRatio="xMidYMid slice">
        <use xlinkHref={props.name.includes(':') ? props.name : `${icons}#${props.name}`} />
      </svg>
    )
}

export default SvgIcon
