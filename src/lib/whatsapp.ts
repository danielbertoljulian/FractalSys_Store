const WHATSAPP_NUMBER = "5551997319858"

export interface CartItemForWhatsApp {
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
}

export interface CustomerData {
  name: string
  phone: string
  city: string
  address: string
  notes?: string
}

export function generateWhatsAppOrderMessage(
  items: CartItemForWhatsApp[],
  customer: CustomerData,
  total: number,
): string {
  const lines: string[] = []
  lines.push("🛒 *NOVO PEDIDO - FractalSyS Store*\n")

  items.forEach((item, idx) => {
    const details = [`${item.name}`]
    if (item.size) details.push(`Tamanho: ${item.size}`)
    if (item.color) details.push(`Cor: ${item.color}`)
    details.push(`Qtd: ${item.quantity}`)
    details.push(`Valor: R$ ${(item.price * item.quantity).toFixed(2)}`)
    lines.push(`${idx + 1}. ${details.join(" | ")}`)
  })

  lines.push(`\n*Total: R$ ${total.toFixed(2)}*\n`)
  lines.push("━ *Dados do Cliente* ━")
  lines.push(`Nome: ${customer.name}`)
  lines.push(`WhatsApp: ${customer.phone}`)
  lines.push(`Cidade: ${customer.city}`)
  lines.push(`Endereço: ${customer.address}`)
  if (customer.notes) {
    lines.push(`Observações: ${customer.notes}`)
  }

  return lines.join("\n")
}

export function openWhatsAppOrder(
  items: CartItemForWhatsApp[],
  customer: CustomerData,
  total: number,
) {
  const message = generateWhatsAppOrderMessage(items, customer, total)
  const encoded = encodeURIComponent(message)
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank")
}

export function getWhatsAppUrl(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}`
}
