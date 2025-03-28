/* eslint-disable jsx-a11y/alt-text */
"use client";
import React from "react";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  Image,
} from "@react-pdf/renderer";

//
// 1. Tipos e interfaces
//
interface OrderReceiptPDFProps {
  id_order?: string;
  id_user: string;
  order_number?: string;
  id_costumer?: string | null | undefined;
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
}

interface OrderPDFProps {
  order: OrderReceiptPDFProps;
}

//
// 2. Estilos do PDF
//
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
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
  },
});

//
// 3. Funções utilitárias
//
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

//
// 4. Componente que gera o PDF
//
function OrderPDF({ order }: OrderPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Barra azul no topo */}
        <View style={styles.borda} />

        {/* Cabeçalho com dados da empresa + logo */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.companyTitle}>Viajando San Andrés</Text>
            <Text>CNPJ 41.174.011/0001-75</Text>
            <Text>Cadastur 41.174.011/0001-75</Text>
            <Text>Rua Rogério Giorgi, 29 - São Paulo - SP</Text>
          </View>
          <View>
            {/* Ajuste o caminho da imagem conforme sua pasta public */}
            <Image style={styles.image} src="/logo.png" />
          </View>
        </View>

        {/* Título e dados do orçamento */}
        <Text style={styles.title}>Dados do Orçamento</Text>
        <Text style={styles.text}>Orçamento: {order.order_number}</Text>
        <Text style={styles.text}>
          {order.pre_name ? toTitleCase(order.pre_name) : ""}
        </Text>
        <Text style={styles.text}>Email: {order.pre_email}</Text>
        <Text style={styles.text}>
          Telefone: +{order.pre_ddi} {order.pre_ddd}{" "}
          {formatPhone(order.pre_phone ?? "")}
        </Text>

        <View style={styles.line} />

        {/* Seção de serviços */}
        <Text style={styles.title2}>Passeios</Text>
        <View style={styles.line} />

        <View style={styles.servicesContainer}>
          <View style={styles.serviceRow}>
            <Text style={styles.serviceDescription}>Descrição</Text>
            <Text style={styles.servicePrice}>Preço</Text>
            <Text style={styles.serviceDiscount}>Desconto</Text>
            <Text style={styles.serviceDate}>Data sugerida</Text>
          </View>

          {order.orders_service.map((service, index) => (
            <View key={index} style={styles.serviceRow}>
              <Text style={styles.serviceDescription}>
                {service.service.description}
              </Text>
              <Text style={styles.servicePrice}>
                {Number(service.price).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
              <Text style={styles.serviceDiscount}>
                {Number(service.discount).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
              <Text style={styles.serviceDate}>
                {new Date(service.suggested_date).toLocaleDateString("pt-BR")}
              </Text>
            </View>
          ))}
        </View>

        {/* Rodapé com total e nova barra azul */}
        <View style={styles.footer}>
          <View style={styles.line} />
          <Text style={styles.total}>
            Total:{" "}
            {order.price
              ? Number(order.price).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              : "R$ 0,00"}
          </Text>
          <View style={styles.line} />
          <View style={styles.borda} />
        </View>
      </Page>
    </Document>
  );
}

//
// 5. Componente da página em si
//
export default function PDFPage() {
  const [orderData, setOrderData] = React.useState<OrderReceiptPDFProps | null>(
    null
  );

  // Dados fictícios só para exemplo.
  // Substitua por sua chamada de API ou dados reais.
  React.useEffect(() => {
    setOrderData({
      id_user: "1",
      order_number: "12345",
      pre_name: "joão da silva",
      pre_email: "joao@example.com",
      pre_ddi: "55",
      pre_ddd: "11",
      pre_phone: "999999999",
      price: 150.0,
      orders_service: [
        {
          id_order_service: 1,
          id_service: 1,
          discount: 0,
          price: 150.0,
          suggested_date: "2025-03-27T00:00:00.000Z",
          service: {
            description: "Passeio turístico",
          },
        },
      ],
    });
  }, []);

  if (!orderData) {
    return <div>Carregando dados do orçamento...</div>;
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <PDFViewer width="100%" height="100%">
        <OrderPDF order={orderData} />
      </PDFViewer>
    </div>
  );
}
