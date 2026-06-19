export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export function parseBrPrice(value: string | null | undefined): number {
  return parseFloat((value || "0").replace(/\./g, "").replace(",", "."))
}
