// app/orderdocumentation/[id]/page.tsx

import ClientOrderDocumentation from "@/components/documentsPage";

// interface OrderDocumentationPageProps {
//   params: {
//     id: string;
//   };
// }

export type paramsType = Promise<{ id: string }>;

export default async function OrderDocumentationPage(props: {
  params: paramsType;
}) {
  // Agora, 'params' já é um objeto normal, não uma Promise
  const { id } = await props.params;
  console.log("param", id);
  return <ClientOrderDocumentation id={id} />;
}
