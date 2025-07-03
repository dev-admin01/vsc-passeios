"use client";

import { use } from "react";

export default function UpdateOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  console.log(resolvedParams);
  return (
    <div className="p-4 min-h-screen bg-sky-100 flex justify-center items-center">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">EM MANUTENÇÃO</h1>
      </div>
    </div>
  );
}
// "use client";

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { CreateOrderPayload } from "@/app/hooks/orders/useCreateOrders";
// import {
//   UpdateServicesSelector,
//   UpdateServiceSelection,
// } from "@/components/updateServiceSelection";
// import { useCreateOrder } from "@/app/hooks/orders/useCreateOrders";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";
// import { toast } from "sonner";
// import { useGetCoupons } from "@/app/hooks/orders/useGetCoupons";
// import { useGetCondPag } from "@/app/hooks/condicaoPagamento/useGetCondPag";
// import { useRouter } from "next/navigation";
// import { useSingleOrder } from "@/app/hooks/orders/useGetOrderDoc";

// export default function UpdateOrderPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const [idUser, setIdUser] = useState<string>("");
//   const [price, setPrice] = useState(0);
//   const [services, setServices] = useState<UpdateServiceSelection[]>([]);
//   const [name, setName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [ddi, setDdi] = useState<string>("");
//   const [ddd, setDdd] = useState<string>("");
//   const [phone, setPhone] = useState<string>("");
//   const [loadingUser, setLoadingUser] = useState(true);
//   const { createOrder } = useCreateOrder();
//   const [selectedCoupon, setSelectedCoupon] = useState<string>("");
//   const { coupons, loading: loadingCoupons } = useGetCoupons();
//   const { condPag, loading: loadingCondPag } = useGetCondPag();
//   const [selectedCondPag, setSelectedCondPag] = useState<string>("");
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [orderId, setOrderId] = useState<string>("");

//   useEffect(() => {
//     const getOrderId = async () => {
//       try {
//         const resolvedParams = await Promise.resolve(params);
//         setOrderId(resolvedParams.id);
//       } catch (error) {
//         console.error("Erro ao obter ID da ordem:", error);
//         toast.error("Erro ao carregar dados da ordem");
//       }
//     };

//     getOrderId();
//   }, [params]);

//   function formatCurrency(value: number): string {
//     const valueInCents = Math.round(value * 100);
//     let formattedValue = valueInCents.toString();
//     formattedValue = formattedValue.padStart(3, "0");
//     const reais = formattedValue.slice(0, -2);
//     const centavos = formattedValue.slice(-2);
//     const reaisFormatados = reais.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//     return `${reaisFormatados},${centavos}`;
//   }

//   function formatPhone(value: string): string {
//     const numbers = value.replace(/\D/g, "");
//     const limitedNumbers = numbers.slice(0, 11);
//     if (limitedNumbers.length <= 1) {
//       return limitedNumbers;
//     } else if (limitedNumbers.length <= 6) {
//       return `${limitedNumbers.slice(0, 1)} ${limitedNumbers.slice(1)}`;
//     } else {
//       return `${limitedNumbers.slice(0, 1)} ${limitedNumbers.slice(1, 6)}-${limitedNumbers.slice(6)}`;
//     }
//   }

//   function removePhoneMask(value: string): string {
//     return value.replace(/\D/g, "");
//   }

//   useEffect(() => {
//     const fetchUserId = async () => {
//       setIdUser("1");
//       setLoadingUser(false);
//     };

//     fetchUserId();
//   }, []);

//   useEffect(() => {
//     const fetchOrderData = async () => {
//       if (!orderId) return;

//       try {
//         const orderResponse = await useSingleOrder(orderId);
//         const orderData = orderResponse.order;

//         setName(orderData.pre_name || "");
//         setEmail(orderData.pre_email || "");
//         setDdi(orderData.pre_ddi || "");
//         setDdd(orderData.pre_ddd || "");
//         setPhone(orderData.pre_phone || "");
//         setSelectedCoupon(orderData.id_coupons || "");
//         setSelectedCondPag(orderData.id_cond_pag || "");
//         setPrice(Number(orderData.price.replace(",", ".")) || 0);

//         const formattedServices = orderData.orders_service.map(
//           (service: any) => ({
//             id_order_service: service.id_order_service,
//             id_service: service.id_service,
//             price: Number(service.price.replace(",", ".")),
//             discount: Number(service.discount),
//             suggested_date: service.suggested_date,
//             time: service.time ? [service.time] : [],
//           })
//         );

//         setServices(formattedServices);
//         setLoading(false);
//       } catch (error) {
//         console.error("Erro ao carregar dados da ordem:", error);
//         toast.error("Erro ao carregar dados da ordem");
//         setLoading(false);
//       }
//     };

//     fetchOrderData();
//   }, [orderId]);

//   useEffect(() => {
//     const total = services.reduce((acc, service) => {
//       const price = Number(service.price) || 0;
//       const discountPercent = Number(service.discount) || 0;
//       const quantity = 1;
//       const priceWithDiscount = price - price * (discountPercent / 100);
//       return acc + priceWithDiscount * quantity;
//     }, 0);

//     let finalPrice = total;
//     if (selectedCoupon) {
//       const coupon = coupons.find((c) => c.id_coupons === selectedCoupon);
//       if (coupon) {
//         finalPrice = total - total * (Number(coupon.discount) / 100);
//       }
//     }

//     setPrice(finalPrice);
//   }, [services, selectedCoupon, coupons]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (loadingUser || !idUser) {
//       toast.error(
//         "Aguardando carregamento do usuário. Por favor, tente novamente em instantes."
//       );
//       return;
//     }

//     const updatedOrder: CreateOrderPayload = {
//       id_user: idUser,
//       pre_name: name,
//       pre_email: email,
//       pre_ddi: ddi,
//       pre_ddd: ddd,
//       pre_phone: phone,
//       price: price.toString(),
//       id_cond_pag: selectedCondPag ? selectedCondPag : "",
//       id_coupons: selectedCoupon ? selectedCoupon : "",
//       services: services
//         .filter((service) => service.id_service !== undefined)
//         .map((service) => ({
//           id_service: service.id_service!,
//           price: service.price?.toString() || "0",
//           quantity: 1,
//           discount: service.discount ?? 0,
//           suggested_date: service.suggested_date
//             ? new Date(service.suggested_date).toISOString()
//             : undefined,
//           time: service.time?.[0] || undefined,
//         })),
//     };

//     try {
//       const response = await createOrder(updatedOrder);
//       localStorage.setItem(
//         "orderSuccessMessage",
//         response.message || "Orçamento atualizado com sucesso!"
//       );
//       router.push("/orders");
//     } catch (error) {
//       console.log(error);
//       toast.error("Erro ao atualizar orçamento");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p>Carregando dados do orçamento...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 min-h-screen bg-sky-100">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-bold">Atualizar Orçamento</h1>
//         <Button className="cursor-pointer">
//           <Link href="/orders" title="Voltar">
//             <ArrowLeft />
//           </Link>
//         </Button>
//       </div>

//       <div className="bg-white p-4 rounded shadow-md">
//         <form onSubmit={handleSubmit} className="flex flex-wrap">
//           <div className="flex flex-wrap">
//             <div className="w-1/2 p-2">
//               <label className="font-semibold">Nome:</label>
//               <Input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//             <div className="w-1/2 p-2">
//               <label className="font-semibold">Email:</label>
//               <Input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div className="w-1/8 p-2">
//               <label className="font-semibold">DDI:</label>
//               <Input
//                 type="text"
//                 value={ddi}
//                 onChange={(e) => setDdi(e.target.value)}
//               />
//             </div>
//             <div className="w-1/8 p-2">
//               <label className="font-semibold">DDD:</label>
//               <Input
//                 type="text"
//                 value={ddd}
//                 onChange={(e) => setDdd(e.target.value)}
//               />
//             </div>
//             <div className="w-1/4 p-2">
//               <label className="font-semibold">Telefone:</label>
//               <Input
//                 type="text"
//                 value={formatPhone(phone)}
//                 onChange={(e) => setPhone(removePhoneMask(e.target.value))}
//                 maxLength={12}
//               />
//             </div>
//           </div>
//           <div className="flex flex-wrap w-full">
//             <div className="w-1/3 p-2">
//               <label className="font-semibold ">Cupom de Desconto:</label>
//               <Input
//                 type="text"
//                 value={selectedCoupon}
//                 onChange={(e) => setSelectedCoupon(e.target.value)}
//                 list="coupons"
//               />
//               <datalist id="coupons">
//                 <option value="none">Nenhum cupom</option>
//                 {!loadingCoupons &&
//                   coupons.map((coupon) => (
//                     <option key={coupon.id_coupons} value={coupon.id_coupons}>
//                       {coupon.coupon} - {coupon.discount} (%)
//                     </option>
//                   ))}
//               </datalist>
//             </div>
//             <div className="w-1/3 p-2">
//               <label className="font-semibold ">Condição de Pagamento:</label>
//               <Input
//                 type="text"
//                 value={selectedCondPag}
//                 onChange={(e) => setSelectedCondPag(e.target.value)}
//                 list="condPag"
//               />
//               <datalist id="condPag">
//                 <option value="none">Nenhuma condição</option>
//                 {!loadingCondPag &&
//                   condPag
//                     .filter(
//                       (cond) =>
//                         cond.description !== "Pix" &&
//                         cond.description !== "pix" &&
//                         cond.description !== "PIX"
//                     )
//                     .map((cond) => (
//                       <option
//                         key={cond.id_cond_pag}
//                         value={cond.id_cond_pag.toString()}
//                       >
//                         {cond.description} - {cond.installments} parcelas
//                       </option>
//                     ))}
//               </datalist>
//             </div>
//             <div className="w-1/3 p-2">
//               <label className="font-semibold">Preço Total (R$):</label>
//               <Input type="text" value={formatCurrency(price)} readOnly />
//             </div>
//           </div>

//           <div className="w-full p-2">
//             <UpdateServicesSelector
//               onChange={setServices}
//               initialServices={services}
//             />
//           </div>

//           <div className="flex justify-end gap-2 mt-4 w-full">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => window.history.back()}
//             >
//               Cancelar
//             </Button>
//             <Button type="submit">Atualizar</Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
