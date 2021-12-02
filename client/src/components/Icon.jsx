import React from 'react'

const Icon = ({ className, name }) => {  
	return (
		<svg className={className}>
			<use xlinkHref={`/img/icons.svg#icon-${name}`} />
		</svg>
	)
}

export default Icon