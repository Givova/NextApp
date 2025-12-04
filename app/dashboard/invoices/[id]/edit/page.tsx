import Form from "@/app/ui/invoices/edit-form"
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs"
import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data"
import { Suspense } from "react"
import { notFound } from "next/navigation"

// Помечаем страницу как динамическую — не генерировать статически
export const dynamic = "force-dynamic"

async function EditFormWrapper({ id }: { id: string }) {
	const [invoice, customers] = await Promise.all([
		fetchInvoiceById(id),
		fetchCustomers(),
	])

	if (!invoice) {
		notFound()
	}

	return (
		<Form
			invoice={invoice}
			customers={customers}
		/>
	)
}

// Компонент для загрузки контента с params
async function EditPageContent({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: "Счета", href: "/dashboard/invoices" },
					{
						label: "Редактировать счет",
						href: `/dashboard/invoices/${id}/edit`,
						active: true,
					},
				]}
			/>
			<Suspense fallback={<div>Загрузка формы...</div>}>
				<EditFormWrapper id={id} />
			</Suspense>
		</main>
	)
}

export default function Page(props: { params: Promise<{ id: string }> }) {
	return (
		<Suspense fallback={<div>Загрузка...</div>}>
			<EditPageContent params={props.params} />
		</Suspense>
	)
}
