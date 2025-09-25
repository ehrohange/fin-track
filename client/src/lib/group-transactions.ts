import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

import type { TransactionForChart } from "@/lib/types-index";

type ChartData = {
  label: string;
  income: number;
  expense: number;
  savings: number;
};

export function groupTransactions(
  transactions: TransactionForChart[],
  period: "month" | "year" | "all"
): ChartData[] {
  const grouped: Record<string, ChartData> = {};
  const now = dayjs();

  if (period === "month") {
    const daysInMonth = now.daysInMonth();
    for (let d = 1; d <= daysInMonth; d++) {
      grouped[d] = { label: `Day ${d}`, income: 0, expense: 0, savings: 0 };
    }
    transactions.forEach((t) => {
      const d = dayjs(t.date).date();
      if (!grouped[d]) return;
      grouped[d][t.categoryId.type] += t.amount;
    });
  }

  if (period === "year") {
  for (let m = 0; m < 12; m++) {
    const key = `${now.year()}-${m}`;
    grouped[key] = {
      label: dayjs().month(m).format("MMM"),
      income: 0,
      expense: 0,
      savings: 0,
    };
  }

  transactions.forEach((t) => {
    const date = dayjs(t.date);
    if (date.year() !== now.year()) return; // only current year

    const key = `${date.year()}-${date.month()}`;
    if (!grouped[key]) return;

    grouped[key][t.categoryId.type] += t.amount;
  });
}


  if (period === "all") {
    if (transactions.length === 0) return [];

    const firstYear = dayjs(transactions[transactions.length - 1].date).year();
    const lastYear = dayjs(transactions[0].date).year();

    for (let y = firstYear; y <= lastYear; y++) {
      grouped[y] = {
        label: `${y}`,
        income: 0,
        expense: 0,
        savings: 0,
      };
    }

    transactions.forEach((t) => {
      const y = dayjs(t.date).year();
      if (!grouped[y]) return;
      grouped[y][t.categoryId.type] += t.amount;
    });
  }

  return Object.values(grouped);
}
