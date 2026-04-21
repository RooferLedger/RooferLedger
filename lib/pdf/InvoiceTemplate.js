import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'extrabold',
    color: '#0d1117',
  },
  companyDetails: {
    fontSize: 10,
    color: '#586069',
    marginTop: 4,
  },
  invoiceDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  clientBox: {
    width: '50%',
  },
  metaBox: {
    width: '40%',
    textAlign: 'right',
  },
  label: {
    fontSize: 10,
    color: '#8b949e',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  valueList: {
    fontSize: 11,
    color: '#24292f',
    marginBottom: 2,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 4,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f6f8fa',
  },
  tableColDescHeader: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f6f8fa',
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColDesc: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#586069',
  },
  tableCell: {
    margin: 8,
    fontSize: 10,
    color: '#24292f',
  },
  totalsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalsBox: {
    width: '45%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#24292f',
  },
  totalLabel: {
    fontSize: 11,
    color: '#586069',
  },
  totalValue: {
    fontSize: 11,
    color: '#24292f',
    textAlign: 'right',
  },
  totalValueFinal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d1117',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#8b949e',
    fontSize: 9,
    borderTopWidth: 1,
    borderTopColor: '#e1e4e8',
    paddingTop: 10,
  }
})

// Reusable Document Component
export const InvoiceDocument = ({ invoiceData }) => {
  const { invoiceId, date, clientName, clientEmail, clientPhone, subtotal, tax, total, lineItems, companyName, companyEmail, companyPhone, companyAddress, logoUrl, notes } = invoiceData

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header Content */}
        <View style={styles.header}>
          <View>
            {logoUrl ? (
              <Image src={logoUrl} style={{ maxWidth: 150, maxHeight: 60, marginBottom: 10 }} />
            ) : null}
            <Text style={styles.title}>{companyName || 'Apex Roofing'}</Text>
            {Boolean(companyAddress) ? <Text style={styles.companyDetails}>{companyAddress}</Text> : null}
            {Boolean(companyEmail) ? <Text style={styles.companyDetails}>{companyEmail}</Text> : null}
            {Boolean(companyPhone) ? <Text style={styles.companyDetails}>{companyPhone}</Text> : null}
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 28, color: '#e1e4e8', fontWeight: 'bold' }}>INVOICE</Text>
          </View>
        </View>

        {/* Client & Meta */}
        <View style={styles.invoiceDetailsRow}>
          <View style={styles.clientBox}>
            <Text style={styles.label}>Bill To:</Text>
            <Text style={styles.valueList}>{clientName || 'Valued Client'}</Text>
            {Boolean(clientEmail) ? <Text style={styles.valueList}>{clientEmail}</Text> : null}
            {Boolean(clientPhone) ? <Text style={styles.valueList}>{clientPhone}</Text> : null}
          </View>
          <View style={styles.metaBox}>
            <Text style={styles.label}>Invoice Number:</Text>
            <Text style={styles.valueList}>{invoiceId || 'INV-0001'}</Text>
            <Text style={[styles.label, { marginTop: 10 }]}>Date Issued:</Text>
            <Text style={styles.valueList}>{date || new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}> 
          <View style={styles.tableRow}> 
            <View style={styles.tableColDescHeader}> 
              <Text style={styles.tableCellHeader}>Description</Text> 
            </View> 
            <View style={styles.tableColHeader}> 
              <Text style={styles.tableCellHeader}>QTY</Text> 
            </View> 
            <View style={styles.tableColHeader}> 
              <Text style={styles.tableCellHeader}>Unit Price</Text> 
            </View> 
            <View style={styles.tableColHeader}> 
              <Text style={styles.tableCellHeader}>Amount</Text> 
            </View> 
          </View>
          
          {lineItems.map((item, i) => (
            <View style={styles.tableRow} key={i}> 
              <View style={styles.tableColDesc}> 
                <Text style={styles.tableCell}>{item.description}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{item.quantity}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>${Number(item.unitPrice).toFixed(2)}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>${(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}</Text> 
              </View> 
            </View> 
          ))}
        </View>

        {/* Totals & Notes Container */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          
          {/* Notes Box (Left Side) */}
          <View style={{ width: '50%' }}>
            {Boolean(notes) ? (
              <View style={{ backgroundColor: '#f6f8fa', padding: 12, borderRadius: 4, marginTop: 10 }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#586069', marginBottom: 4 }}>Notes:</Text>
                <Text style={{ fontSize: 10, color: '#24292f', lineHeight: 1.4 }}>{notes}</Text>
              </View>
            ) : null}
          </View>

          {/* Totals Box (Right Side) */}
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>${Number(subtotal).toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>${Number(tax).toFixed(2)}</Text>
            </View>
            <View style={styles.totalRowFinal}>
              <Text style={styles.totalLabel}>Total Due</Text>
              <Text style={styles.totalValueFinal}>${Number(total).toFixed(2)}</Text>
            </View>
          </View>

        </View>

        <View style={styles.footer}>
          <Text>Thank you for your business. Please make payment within 15 days of receiving this invoice.</Text>
        </View>

      </Page>
    </Document>
  )
}
