import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import type { Transaction } from "@/lib/types-index";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import DeleteTransaction from "./delete-transaction";
import { Card, CardContent } from "./ui/card";
import { Banknote } from "lucide-react";
import { deleteTransaction } from "@/redux/transaction/transactionsSlice";

interface TransactionTableProps {
  transactions: Transaction[];
  total?: number;
  date?: string;
}

const TransactionTable = ({
  transactions,
  total,
  date,
}: TransactionTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = transactions.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const dispatch = useDispatch();

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const formatDate = (d: Date | undefined) => {
    if (!d) return "";
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day} ${year}`; // e.g. "Aug 25 2025"
  };

  const toPeso = (num: number) => {
    return num.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    });
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleRemoveTransaction = (id: string) => {
    dispatch(deleteTransaction(id));
  };
  return (
    <section className="w-full max-w-6xl mt-6">
      <hr className="mb-4 mt-3" />
      {transactions.length > 0 ? (
        <>
          <h4 className="text-white/80">These are all your</h4>
          <h1 className="font-bold font-doto text-2xl sm:text-3xl">
            Transactions {date && `for ${date}`}
          </h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Desc</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRows.map((item, index) => (
                <TableRow
                  key={item._id}
                  className={(index % 2 && "bg-primary/8") || ""}
                >
                  <TableCell>
                    {formatDate(item.date ? new Date(item.date) : undefined)}
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    {capitalizeFirstLetter(item.categoryId.type)}
                  </TableCell>
                  <TableCell>{item.categoryId.name}</TableCell>
                  <TableCell
                    className={
                      cn(
                        item.categoryId.type === "expense" &&
                          "text-destructive",
                        item.categoryId.type === "savings" && "text-white/90",
                        item.categoryId.type === "income" &&
                          "text-primary font-semibold"
                      ) + " text-right"
                    }
                  >
                    {item.categoryId.type === "income"
                      ? `+${toPeso(item.amount)}`
                      : `-${toPeso(item.amount)}`}
                  </TableCell>
                  <TableCell>
                    {currentUser && (
                      <DeleteTransaction
                        userId={currentUser._id}
                        _id={item._id}
                        onDeleted={handleRemoveTransaction}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {typeof total === "number" && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total Balance</TableCell>
                  <TableCell
                    colSpan={1}
                    className={`font-bold ${
                      total > 0
                        ? "text-primary"
                        : total < 0
                        ? "text-destructive"
                        : "text-white/90"
                    } text-right`}
                  >
                    {toPeso(total)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
          <div className="w-full flex items-center justify-center gap-4 mt-4 max-w-lg mx-auto">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>

            <p className="text-sm text-white/85 flex-grow text-center">
              Page{" "}
              <span className="text-primary font-bold text-[15px]">
                {currentPage}
              </span>{" "}
              of {totalPages}
            </p>

            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="relative">
          <img src="/emptytrans.webp" alt="empty transactions" />
          <Card className="absolute inset-0 m-auto py-2 w-fit h-fit">
            <CardContent className="flex items-center justify-center gap-2 text-destructive">
              <Banknote />
              <p>No available transactions yet.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
};

export default TransactionTable;
