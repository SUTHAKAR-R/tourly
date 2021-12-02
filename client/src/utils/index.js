import { WebMercatorViewport } from 'react-map-gl'

const applyToArray = (func, array) => func.apply(Math, array)

export const getBounds = points => {
	const pointsLong = points.map(point => point.geometry.coordinates[0])
	const pointsLat = points.map(point => point.geometry.coordinates[1])
	const cornersLongLat = [
		[applyToArray(Math.min, pointsLong), applyToArray(Math.min, pointsLat)],
		[applyToArray(Math.max, pointsLong), applyToArray(Math.max, pointsLat)]
	]
	const viewport = new WebMercatorViewport({ width: 800, height: 600 }).fitBounds(cornersLongLat, { padding: 200 })
	const { longitude, latitude, zoom } = viewport
	return { longitude, latitude, zoom }
}