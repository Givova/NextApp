import Form from "@/app/ui/invoices/edit-form"
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs"
import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data"
import { Suspense } from "react"
import { notFound } from "next/navigation"

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

export default async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params
	const id = params.id

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
