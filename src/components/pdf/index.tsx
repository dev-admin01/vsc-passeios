// /* eslint-disable jsx-a11y/alt-text */
// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   StyleSheet,
//   View,
//   Image,
// } from "@react-pdf/renderer";

// // Define a interface com os dados que você precisa
// interface OrderPDFProps {
//   order: OrderReceiptPDFProps;
// }

// export interface OrderReceiptPDFProps {
//   id_order?: string;
//   id_user: string;
//   order_number?: string;
//   id_costumer?: string | null | undefined;
//   pre_name?: string;
//   pre_email?: string;
//   pre_ddi?: string;
//   pre_ddd?: string;
//   pre_phone?: string;
//   price?: number;
//   orders_service: {
//     id_order_service: number;
//     id_service: number;
//     discount: number;
//     price: number;
//     suggested_date: string;
//     service: {
//       description: string;
//     };
//   }[];
//   // Adicione outros campos se necessário
// }

// // Estilos do PDF
// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 11,
//     lineHeight: 1.4,
//     fontFamily: "Times-Roman",
//   },
//   borda: {
//     height: 20,
//     backgroundColor: "#0180ff",
//     marginBottom: 30,
//   },
//   headerContainer: {
//     marginBottom: 30,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   companyTitle: {
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   header: {
//     fontSize: 14,
//     marginBottom: 20,
//     textAlign: "center",
//     color: "gray",
//   },
//   section: {
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 18,
//     marginBottom: 8,
//   },
//   text: {
//     fontSize: 12,
//     marginBottom: 4,
//   },
//   image: {
//     height: 80,
//     width: 80,
//   },
//   line: {
//     backgroundColor: "black",
//     height: 2,
//     marginVertical: 5,
//   },
//   title2: {
//     fontSize: 18,
//     fontWeight: "bold",
//     margin: 5,
//   },
//   servicesContainer: {
//     marginTop: 5,
//   },
//   serviceRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 3,
//   },
//   serviceDescription: {
//     fontSize: 10,
//     flex: 1,
//   },
//   servicePrice: {
//     fontSize: 10,
//     width: 80,
//     textAlign: "right",
//   },
//   serviceDiscount: {
//     fontSize: 10,
//     width: 80,
//     textAlign: "right",
//   },
//   serviceDate: {
//     fontSize: 10,
//     width: 100,
//     textAlign: "center",
//   },
//   total: {
//     fontSize: 22,
//     textAlign: "right",
//     fontWeight: "bold",
//     margin: 5,
//   },
//   footer: {
//     position: "absolute",
//     bottom: 30,
//     left: 30,
//     right: 30,
//     textAlign: "center",
//   },
// });

// function toTitleCase(str: any) {
//   return str.replace(
//     /\w\S*/g,
//     (txt: any) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
//   );
// }

// function formatPhone(phone: any) {
//   if (!phone) return "";
//   const phoneStr = phone.toString();
//   if (phoneStr.length <= 4) return phoneStr;
//   return (
//     phoneStr.slice(0, phoneStr.length - 4) +
//     "-" +
//     phoneStr.slice(phoneStr.length - 4)
//   );
// }

// function OrderPDF({ order }: OrderPDFProps) {
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.borda}></View>
//       <View style={styles.headerContainer}>
//         <View>
//           <Text style={styles.companyTitle}>Viajando San Andrés</Text>
//           <Text>CNPJ 41.174.011/0001-75</Text>
//           <Text>Cadastur 41.174.011/0001-75</Text>
//           <Text>Rua Rogério Giorgi, 29 - São Paulo - SP</Text>
//         </View>
//         <View>
//           <Image style={styles.image} src="/logo.png" />
//         </View>
//       </View>

//       <Text style={styles.title}>Dados do Orçamento</Text>

//       <Text style={styles.text}>Orçamento: {order.order_number}</Text>
//       <Text style={styles.text}>
//         {order.pre_name ? toTitleCase(order.pre_name) : ""}
//       </Text>
//       <Text style={styles.text}>Email: {order.pre_email}</Text>
//       <Text style={styles.text}>
//         Telefone: +{order.pre_ddi} {order.pre_ddd}{" "}
//         {formatPhone(order.pre_phone)}
//       </Text>

//       <View style={styles.line}></View>
//       <Text style={styles.title2}>Passeios</Text>
//       <View style={styles.line}></View>
//       <View style={styles.servicesContainer}>
//         <View style={styles.serviceRow}>
//           <Text style={styles.serviceDescription}>Descrição</Text>
//           <Text style={styles.servicePrice}>Preço</Text>
//           <Text style={styles.serviceDiscount}>Desconto</Text>
//           <Text style={styles.serviceDate}>Data sugerida</Text>
//         </View>
//         {order.orders_service.map((service, index) => (
//           <View key={index} style={styles.serviceRow}>
//             <Text style={styles.serviceDescription}>
//               {service.service.description}
//             </Text>
//             <Text style={styles.servicePrice}>
//               {Number(service.price).toLocaleString("pt-BR", {
//                 style: "currency",
//                 currency: "BRL",
//               })}
//             </Text>
//             <Text style={styles.serviceDiscount}>
//               {Number(service.discount).toLocaleString("pt-BR", {
//                 style: "currency",
//                 currency: "BRL",
//               })}
//             </Text>
//             <Text style={styles.serviceDate}>
//               {new Date(service.suggested_date).toLocaleDateString("pt-BR")}
//             </Text>
//           </View>
//         ))}
//       </View>
//       <View style={styles.footer}>
//         <View style={styles.line}></View>

//         <Text style={styles.total}>
//           Total:{" "}
//           {order.price
//             ? Number(order.price).toLocaleString("pt-BR", {
//                 style: "currency",
//                 currency: "BRL",
//               })
//             : "R$ 0,00"}
//         </Text>
//         <View style={styles.line}></View>

//         <View style={styles.borda}></View>
//       </View>
//     </Page>
//   </Document>;
// }

// return OrderPDF
