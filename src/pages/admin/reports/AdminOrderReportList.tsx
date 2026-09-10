import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminOrderReports } from "@/hooks/useAdminOrderReports";
import { reportReasonLabels, reportStatusBadgeVariant } from "@/lib/orderReportUtils";
import type { OrderReportStatus } from "@/types/orderReport";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const STATUSES: (OrderReportStatus | "ALL")[] = ["ALL", "OPEN", "IN_REVIEW", "RESOLVED", "REJECTED", "CLOSED"];

const AdminOrderReportList: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<OrderReportStatus | "ALL">("ALL");
  const { reports, loading, error } = useAdminOrderReports(statusFilter);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl text-[#2E1F14]">Order Reports</h1>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderReportStatus | "ALL")}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s === "ALL" ? "All statuses" : s.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Loading reports...</TableCell></TableRow>
            ) : reports.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No reports found.</TableCell></TableRow>
            ) : (
              reports.map((r) => (
                <TableRow
                  key={r.id}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => navigate(`/dashboard/admin/reports/${r.id}`)}
                >
                  <TableCell className="font-mono text-xs">{r.orderNumber}</TableCell>
                  <TableCell>
                    {r.userName}
                    <div className="text-xs text-muted-foreground">{r.userEmail}</div>
                  </TableCell>
                  <TableCell>{reportReasonLabels[r.reason]}</TableCell>
                  <TableCell>
                    <Badge variant={reportStatusBadgeVariant(r.status)}>{r.status.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(r.updatedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrderReportList;