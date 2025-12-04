import Form from "@/app/ui/invoices/create-form"
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs"
import { fetchCustomers } from "@/app/lib/data"
import { Suspense } from "react"

// Помечаем страницу как динамическую — не генерировать статически
export const dynamic = "force-dynamic"

async function FormWrapper() {
	const customers = await fetchCustomers()
	return <Form customers={customers} />
}

export default function Page() {
	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: "Счета", href: "/dashboard/invoices" },
					{
						label: "Создать счет",
						href: "/dashboard/invoices/create",
						active: true,
					},
				]}
			/>
			<Suspense fallback={<div>Загрузка формы...</div>}>
				<FormWrapper />
			</Suspense>
		</main>
	)
}
