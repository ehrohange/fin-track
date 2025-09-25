import type { TransactionForChart } from "@/lib/types-index";

type PieChartData = {
  label: string;
  count: number;
};

export function groupTransactionCounts(
  transactions: TransactionForChart[]
): PieChartData[] {
  const grouped: Record<"expense" | "savings", number> = {
    expense: 0,
    savings: 0,
  };

  transactions.forEach((t) => {
    if (t.categoryId.type === "income") return; // exclude incomes
    if (t.categoryId.type === "expense" || t.categoryId.type === "savings") {
      grouped[t.categoryId.type] += 1;
    }
  });

  return [
    { label: "Expenses", count: grouped.expense },
    { label: "Savings", count: grouped.savings },
  ];
}