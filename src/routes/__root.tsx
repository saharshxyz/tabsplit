/// <reference types="vite/client" />

import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRoute
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import type * as React from "react"
import appCss from "~/styles/app.css?url"

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8"
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				title: "Tabsplit"
			}
		],
		links: [{ rel: "stylesheet", href: appCss }]
	}),
	component: RootComponent
})

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
			<TanStackRouterDevtools position="bottom-right" />
		</RootDocument>
	)
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="flex items-center justify-center">
				<div className="min-h-screen w-full max-w-prose">
					{children}
					<Scripts />
				</div>
			</body>
		</html>
	)
}
