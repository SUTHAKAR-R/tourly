import React, { useState, Fragment } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import { geojson } from '../../../public/data/geojson'
import { getBounds } from '../../utils'

const Map = () => {	

	const bounds = getBounds(geojson.features)
	const [viewport, setViewport] = useState({
		width: "100%",
		height: "100%",
		...bounds
	})
	const [markerId, setMarkerId] = useState(null)

	return (
		<section className='section-map'>
			<div id='map'>
				<ReactMapGL
					{...viewport}
					mapStyle='mapbox://styles/jonasschmedtmann/cjnxfn3zk7bj52rpegdltx58h'
					mapboxApiAccessToken={import.meta.env.VITE_MAPBOX}
					onViewportChange={setViewport}
				>
					{geojson.features.map((mark, id) => (
						<Fragment key={id}>
							<Marker
								latitude={mark.geometry.coordinates[1]}
								longitude={mark.geometry.coordinates[0]}
							>
								<div onClick={() => setMarkerId(id)} className='marker'></div>
							</Marker>
							{id === markerId && (
								<Popup
									latitude={mark.geometry.coordinates[1]}
									longitude={mark.geometry.coordinates[0]}
									closeButton={true}
									onClose={() => setMarkerId(null)}
									anchor='left'
								>
									<div>{mark.properties.description}</div>
								</Popup>
							)}
						</Fragment>
					))}
				</ReactMapGL>
			</div>
		</section>
	)
}

export default Map