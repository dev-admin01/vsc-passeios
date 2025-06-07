import OrderDocumentationClient from "./client";

export type paramsType = Promise<{ id: string }>;

export default async function OrderDocumentationPage(props: {
  params: paramsType;
}) {
  const { id } = await props.params;
  return <OrderDocumentationClient id={id} />;
}
