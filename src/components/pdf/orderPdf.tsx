import React from "react";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  Image,
} from "@react-pdf/renderer";

import { PDFData } from "@/types/orders.type";

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}
function formatPhone(phone: string) {
  if (!phone) return "";
  if (phone.length <= 4) return phone;
  const tel =
    phone.slice(0, phone.length - 4) + "-" + phone.slice(phone.length - 4);
  return tel || "";
}

function formatCurrency(value: string | number | undefined) {
  if (!value) return "R$ 0,00";

  let numericValue: number;
  if (typeof value === "string") {
    numericValue = parseFloat(value.replace(",", "."));
  } else {
    numericValue = value;
  }

  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function OrderPDF({ pdfData }: PDFData) {
  const { order, condPag } = pdfData;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.borda}></View>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.companyTitle}>Viajando San Andrés</Text>
            <Text>CNPJ 41.174.011/0001-75</Text>
            <Text>Cadastur 41.174.011/0001-75</Text>
            <Text>Rua Rogério Giorgi, 29 - São Paulo - SP</Text>
          </View>
          <View>
            <Image
              style={styles.image}
              src={`${process.env.NEXT_PUBLIC_LOCAL_BASE_URL}/logo.png`}
            />
          </View>
        </View>

        <Text style={styles.title}>Dados do Orçamento</Text>

        <Text style={styles.text}>Orçamento: {order.order_number}</Text>
        <Text style={styles.text}>
          {order.pre_name ? toTitleCase(order.pre_name) : ""}
        </Text>
        <Text style={styles.text}>Email: {order.pre_email}</Text>
        <Text style={styles.text}>
          Telefone: +{order.pre_ddi} {order.pre_ddd}{" "}
          {formatPhone(order.pre_phone || "")}
        </Text>

        <View style={styles.line}></View>
        <Text style={styles.title2}>Passeios</Text>
        <View style={styles.line}></View>
        <View style={styles.servicesContainer}>
          <View style={styles.serviceRow}>
            <Text style={styles.serviceDescription}>Descrição</Text>
            <Text style={styles.serviceDescription}>Quantidade</Text>
            <Text style={styles.servicePrice}>Preço</Text>
            <Text style={styles.serviceDiscount}>Desconto</Text>
            <Text style={styles.serviceDate}>Data sugerida</Text>
          </View>
          {order.orders_service.map((service, index) => (
            <View key={index} style={styles.serviceRow}>
              <Text style={styles.serviceDescription}>
                {service.service.description}
              </Text>
              <Text style={styles.serviceDescription}>{service.quantity}</Text>
              <Text style={styles.servicePrice}>
                {formatCurrency(service.price)}
              </Text>
              <Text style={styles.serviceDiscount}>
                {formatCurrency(
                  order.orders_service[index].discount?.toString() || "0"
                )}
              </Text>
              <Text style={styles.serviceDate}>
                {new Date(
                  order.orders_service[index].suggested_date
                ).toLocaleDateString("pt-BR")}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.line}></View>

          {order.coupons ? (
            <View>
              <Text style={styles.textCondPag}>
                Cupom de desconto aplicado: {order.coupons.coupon} -{" "}
                {order.coupons.discount}%
              </Text>
              <Text style={styles.total}>
                Total: {formatCurrency(order.price)}
              </Text>
            </View>
          ) : (
            <Text style={styles.total}>
              Total: {formatCurrency(order.price)}
            </Text>
          )}

          {condPag.installments === "1" ? (
            condPag.description === "Pix" ? (
              order.coupons ? (
                <Text key={condPag.description} style={styles.textCondPag}>
                  Á vista no {condPag.description}.
                </Text>
              ) : (
                <Text key={condPag.description} style={styles.textCondPag}>
                  À vista no {condPag.description} com {condPag.discount}% de
                  desconto por{" "}
                  {formatCurrency(
                    parseFloat(order.price?.replace(",", ".") || "0") *
                      (1 - parseFloat(condPag.discount) / 100)
                  )}
                </Text>
              )
            ) : (
              <Text key={condPag.description} style={styles.textCondPag}>
                À vista no {condPag.description}.
              </Text>
            )
          ) : (
            <Text key={condPag.description} style={styles.textCondPag}>
              Em até {condPag.installments}x no {condPag.description}
            </Text>
          )}
          {order.cond_pag ? (
            <Text key={order.cond_pag.description} style={styles.textCondPag}>
              Em até {order.cond_pag.installments}x no{" "}
              {order.cond_pag.description}
            </Text>
          ) : null}

          <View style={styles.line}></View>
          <View style={styles.borda}></View>
        </View>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    lineHeight: 1.4,
    fontFamily: "Times-Roman",
  },
  borda: {
    height: 20,
    backgroundColor: "#0180ff",
    marginBottom: 30,
  },
  headerContainer: {
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  companyTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  header: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    color: "gray",
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    marginBottom: 4,
  },
  textCondPag: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: "right",
  },
  image: {
    height: 80,
    width: 80,
  },
  line: {
    backgroundColor: "black",
    height: 2,
    marginVertical: 5,
  },
  title2: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 5,
  },
  servicesContainer: {
    marginTop: 5,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  serviceDescription: {
    fontSize: 10,
    flex: 1,
  },
  servicePrice: {
    fontSize: 10,
    width: 80,
    textAlign: "right",
  },
  serviceDiscount: {
    fontSize: 10,
    width: 80,
    textAlign: "right",
  },
  serviceDate: {
    fontSize: 10,
    width: 100,
    textAlign: "center",
  },
  total: {
    fontSize: 22,
    textAlign: "right",
    fontWeight: "bold",
    margin: 5,
    marginBottom: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
  },
});
