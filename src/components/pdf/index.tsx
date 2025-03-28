// components/pdf/OrderPDF.tsx
"use client"; // garante que tudo aqui é client-side

import React from "react";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  // Image,
} from "@react-pdf/renderer";

// Tipos e interfaces (ajuste conforme necessidade)
interface OrderPDFProps {
  order: {
    id_user: string;
    order_number?: string;
    pre_name?: string;
    pre_email?: string;
    pre_ddi?: string;
    pre_ddd?: string;
    pre_phone?: string;
    price?: number;
    orders_service: {
      id_order_service: number;
      id_service: number;
      discount: number;
      price: number;
      suggested_date: string;
      service: {
        description: string;
      };
    }[];
  };
}

// Seus estilos
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
  // ... etc
});

// Funções auxiliares
function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}
function formatPhone(phone: string) {
  if (!phone) return "";
  if (phone.length <= 4) return phone;
  return phone.slice(0, phone.length - 4) + "-" + phone.slice(phone.length - 4);
}

// Componente que retorna o PDF
export default function OrderPDF({ order }: OrderPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.borda} />
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.companyTitle}>Viajando San Andrés</Text>
            <Text>CNPJ 41.174.011/0001-75</Text>
            <Text>Cadastur 41.174.011/0001-75</Text>
            <Text>Rua Rogério Giorgi, 29 - São Paulo - SP</Text>
          </View>
          <View>
            {/* Ajuste para o caminho que realmente existe em /public */}
            {/* <Image style={styles.image} src="/logo.png" /> */}
          </View>
        </View>

        {/* Título e dados do orçamento */}
        <Text>Orçamento: {order.order_number}</Text>
        <Text>{order.pre_name ? toTitleCase(order.pre_name) : ""}</Text>
        <Text>Email: {order.pre_email}</Text>
        <Text>
          Telefone: +{order.pre_ddi} {order.pre_ddd}{" "}
          {formatPhone(order.pre_phone ?? "")}
        </Text>

        {/* Exemplo de listar os serviços */}
        {order.orders_service.map((service, i) => (
          <View key={i} style={{ marginTop: 10 }}>
            <Text>{service.service.description}</Text>
            <Text>
              {Number(service.price).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
