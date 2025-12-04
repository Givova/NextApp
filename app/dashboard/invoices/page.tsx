import Pagination from "@/app/ui/invoices/pagination"
import Search from "@/app/ui/search"
import Table from "@/app/ui/invoices/table"
import { CreateInvoice } from "@/app/ui/invoices/buttons"
import { lusitana } from "@/app/ui/fonts"
import { InvoicesTableSkeleton } from "@/app/ui/skeletons"
import { Suspense } from "react"
import { fetchInvoicesPages } from "@/app/lib/data"

// Помечаем страницу как динамическую — не генерировать статически
export const dynamic = "force-dynamic"

// Асинхронный компонент, который получает и обрабатывает searchParams
// Вся асинхронная логика перенесена сюда, чтобы быть внутри <Suspense>
async function InvoicesContent({
	searchParams,
}: {
	searchParams: Promise<{ query?: string; page?: string } | undefined>
}) {
	// await searchParams — это блокирующая операция в Next.js 15+
	// Поэтому она должна быть внутри компонента, обёрнутого в <Suspense>
	const params = await searchParams
	const query = params?.query || ""
	const currentPage = Number(params?.page) || 1

	// Получаем общее количество страниц для пагинации
	const totalPages = await fetchInvoicesPages(query)

	return (
		<>
			{/* Поиск и кнопка создания */}
			<div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
				<Search placeholder="Search invoices..." />
				<CreateInvoice />
			</div>

			{/* Таблица с данными — обёрнута во вложенный Suspense */}
			{/* key заставляет React пересоздать компонент при изменении query или page */}
			<Suspense
				key={query + currentPage}
				fallback={<InvoicesTableSkeleton />}
			>
				<Table
					query={query}
					currentPage={currentPage}
				/>
			</Suspense>

			{/* Пагинация */}
			<div className="mt-5 flex w-full justify-center">
				<Pagination totalPages={totalPages} />
			</div>
		</>
	)
}

// Главный компонент страницы — теперь СИНХРОННЫЙ (без async)
// Это позволяет заголовку отрендериться мгновенно
export default function Page(props: {
	searchParams?: Promise<{
		query?: string
		page?: string
	}>
}) {
	return (
		<div className="w-full">
			{/* Заголовок рендерится сразу, без ожидания данных */}
			<div className="flex w-full items-center justify-between">
				<h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
			</div>

			{/* Весь динамический контент обёрнут в Suspense */}
			{/* Пока данные загружаются, показывается скелетон */}
			<Suspense fallback={<InvoicesTableSkeleton />}>
				<InvoicesContent searchParams={props.searchParams!} />
			</Suspense>
		</div>
	)
}
