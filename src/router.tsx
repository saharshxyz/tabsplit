import {
	createRouter as createTanStackRouter,
	parseSearchWith,
	stringifySearchWith
} from "@tanstack/react-router"
import { parse, stringify } from "zipson"
import NotFound from "./components/NotFound"
import { routeTree } from "./routeTree.gen"

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		defaultPreload: "intent",
		defaultErrorComponent: (err) => <p>{err.error.stack}</p>,
		defaultNotFoundComponent: () => <NotFound />,
		scrollRestoration: true,
		parseSearch: parseSearchWith((value) => parse(decodeFromBinary(value))),
		stringifySearch: stringifySearchWith((value) =>
			encodeToBinary(stringify(value))
		)
	})

	return router
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>
	}
}

const decodeFromBinary = (str: string) =>
	decodeURIComponent(
		Array.prototype.map
			.call(
				atob(str),
				(c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`
			)
			.join("")
	)

const encodeToBinary = (str: string) =>
	btoa(
		encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
			String.fromCharCode(Number.parseInt(p1, 16))
		)
	)
