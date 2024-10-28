import ErrorPage from "@/components/ErrorPage";

export default function PageNotFound() {
    return <ErrorPage
        title="A página que você solicitou não foi encontrada"
        description="Pedimos desculpas pelo acontecido, mas não conseguimos encontrar a página solicitada."
    />
}
