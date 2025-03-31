import ClientOrderDocumentation from "@/components/documentsPage";

export type paramsType = Promise<{ id: string }>;

export default async function OrderDocumentationPage(props: {
  params: paramsType;
}) {
  // Agora, 'params' já é um objeto normal, não uma Promise
  const { id } = await props.params;
  return <ClientOrderDocumentation id={id} />;
}
