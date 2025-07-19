import { createFileRoute } from "@tanstack/react-router"
import { Upload, X } from "lucide-react"
import { BackButton } from "src/components/BackButton"
import { Button } from "src/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "src/components/ui/card"
import * as FileUpload from "src/components/ui/file-upload"
import { useFileUpload } from "src/components/ui/file-upload"
import { useAppForm } from "src/components/ui/tanstack-form"
import { cn } from "src/lib/utils"
import * as z from "zod"

const FILE_CONFIG = {
	MAX_SIZE: 1_000_000,
	MIN_SIZE: 100,
	MAX_FILES: 3,
	ACCEPTED_TYPES: [
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/gif",
		"image/webp",
		"application/pdf"
	],
	get ACCEPT_STRING() {
		return this.ACCEPTED_TYPES.join(",")
	},
	get ACCEPTED_EXTENSIONS() {
		return this.ACCEPTED_TYPES.map((type) => type.split("/")[1])
	},
	get FORMATTED_DESCRIPTION() {
		return this.ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`)
	}
}

const uploadFormSchema = z.object({
	receipts: z
		.array(
			z
				.file()
				.min(FILE_CONFIG.MIN_SIZE)
				.max(FILE_CONFIG.MAX_SIZE)
				.mime(FILE_CONFIG.ACCEPTED_TYPES)
		)
		.min(1, "At least one receipt is required")
		.max(
			FILE_CONFIG.MAX_FILES,
			`Maximum ${FILE_CONFIG.MAX_FILES} receipts allowed`
		)
})

export const Route = createFileRoute("/upload")({
	component: RouteComponent
})

function RouteComponent() {
	const form = useAppForm({
		defaultValues: { receipts: [] as File[] },
		validators: {
			onChange: uploadFormSchema
		},
		onSubmit: ({ value }) => {
			console.log(value)
		}
	})

	return (
		<main className="mx-auto flex min-h-dvh items-center justify-center overflow-hidden">
			<div className="w-full">
				<BackButton link="/" text="Back to Home" />

				<Card className="w-full p-10">
					<CardHeader>
						<CardTitle className="text-2xl text-center">
							Upload Receipt
						</CardTitle>
						<CardDescription>
							Upload a picture of your receipt and you will be redirected to a
							pre-filled form. Note that this uses OpenAI and results may vary.
							We recommend verifying the auto-populated data.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form.AppForm>
							<form className="space-y-3">
								<form.AppField
									name="receipts"
									// biome-ignore lint/correctness/noChildrenProp: TanStack Form uses children prop for field rendering
									children={(field) => (
										<field.FormItem>
											<field.FormLabel>Receipt</field.FormLabel>
											<field.FormControl>
												<FileUpload.Root
													value={field.state.value}
													onValueChange={(files) => {
														field.handleChange(files)
													}}
													maxFiles={FILE_CONFIG.MAX_FILES}
													maxSize={FILE_CONFIG.MAX_SIZE}
													accept={FILE_CONFIG.ACCEPT_STRING}
												>
													<DynamicDropzone />
													<FileUpload.List>
														{field.state.value.map((file) => (
															<FileUpload.Item key={file.name} value={file}>
																<FileUpload.ItemPreview />
																<FileUpload.ItemMetadata />
																<FileUpload.ItemDelete asChild>
																	<Button
																		variant="ghost"
																		size="icon"
																		className="h-6 w-6"
																	>
																		<X className="h-4 w-4" />
																	</Button>
																</FileUpload.ItemDelete>
															</FileUpload.Item>
														))}
													</FileUpload.List>
												</FileUpload.Root>
											</field.FormControl>
											<field.FormDescription className="text-xs">
												Accepted file types:{" "}
												{FILE_CONFIG.FORMATTED_DESCRIPTION.map((ext, index) => (
													<span key={ext}>
														<code>{ext}</code>
														{index < FILE_CONFIG.FORMATTED_DESCRIPTION.length - 1 && ", "}
													</span>
												))}
											</field.FormDescription>
											<field.FormMessage />
										</field.FormItem>
									)}
								/>
								<Button type="submit" className="w-full mt-3">
									Submit
								</Button>
							</form>
						</form.AppForm>
					</CardContent>
				</Card>
			</div>
		</main>
	)
}

function DynamicDropzone() {
	function useDropzoneStyles(hasFiles: boolean) {
		return {
			dropzone: cn("w-full my-1 transition-all duration-300", {
				"py-12 min-h-64": !hasFiles
			}),
			icon: cn({ "!h-6": hasFiles, "!h-10": !hasFiles }),
			title: cn("font-semibold text-foreground", { "text-lg": !hasFiles }),
			subtitle: cn("text-muted-foreground/70", {
				"text-xs": hasFiles,
				"text-sm": !hasFiles
			})
		}
	}

	const fileCount = useFileUpload((state) => state.files.size)
	const hasFiles = fileCount > 0
	const styles = useDropzoneStyles(hasFiles)

	return (
		<FileUpload.Dropzone className={styles.dropzone}>
			<div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
				<Upload className={styles.icon} />
				<div className="text-center">
					<p className={styles.title}>Drag & Drop your receipt here</p>
					<p className={styles.subtitle}>or click to select a file</p>
				</div>
			</div>
		</FileUpload.Dropzone>
	)
}
