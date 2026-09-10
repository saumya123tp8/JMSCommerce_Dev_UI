import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getOrderReportDetailAdmin,
  addAdminReportMessage,
  updateReportStatus,
  resolveOrderReport,
} from "@/Service/OrderReportServices";
import {
  reportReasonLabels,
  resolutionTypeLabels,
  reportStatusBadgeVariant,
  allowedReportTransitions,
  isReportOpenForActivity,
} from "@/lib/orderReportUtils";
import { extractApiErrorMessage } from "@/lib/apiError";
import type { OrderReportDetail, OrderReportStatus, ResolutionType } from "@/types/orderReport";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminOrderReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<OrderReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const [resolving, setResolving] = useState(false);
  const [resolutionType, setResolutionType] = useState<ResolutionType | "">("");
  const [resolutionMessage, setResolutionMessage] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchReport = async () => {
    if (!id) return;
    try {
      const data = await getOrderReportDetailAdmin(Number(id));
      setReport(data);
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
      navigate("/dashboard/admin/reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, [id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [report?.messages.length]);

  const handleSend = async () => {
    if (!id || !message.trim()) return;
    setSending(true);
    try {
      const newMsg = await addAdminReportMessage(Number(id), { message: message.trim() });
      setReport((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev));
      setMessage("");
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: OrderReportStatus) => {
    if (!id) return;
    setStatusUpdating(true);
    try {
      const updated = await updateReportStatus(Number(id), { status: newStatus });
      setReport(updated);
      toast.success(`Status changed to ${newStatus.replace("_", " ")}`);
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleResolve = async () => {
    if (!id || !resolutionType || !resolutionMessage.trim()) {
      toast.error("Select a resolution type and add a message.");
      return;
    }
    setResolving(true);
    try {
      const updated = await resolveOrderReport(Number(id), {
        type: resolutionType,
        message: resolutionMessage.trim(),
      });
      setReport(updated);
      toast.success("Report resolved");
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setResolving(false);
    }
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading report...</div>;
  if (!report) return null;

  const nextStatuses = allowedReportTransitions[report.status];
  const canConverse = isReportOpenForActivity(report.status);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/dashboard/admin/reports")}>
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to reports
      </Button>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-sm text-muted-foreground">Order #{report.orderNumber}</p>
          <h1 className="font-serif text-2xl text-[#2E1F14]">{reportReasonLabels[report.reason]}</h1>
        </div>
        <Badge variant={reportStatusBadgeVariant(report.status)}>{report.status.replace("_", " ")}</Badge>
      </div>

      <div className="mb-4 rounded-md border bg-muted/20 p-3 text-sm">{report.description}</div>

      {/* Status transition controls */}
      {nextStatuses.length > 0 && (
        <div className="mb-4 flex gap-2">
          {nextStatuses.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={s === "REJECTED" ? "outline" : "default"}
              className={cn(s === "REJECTED" && "border-destructive text-destructive hover:bg-destructive/10")}
              disabled={statusUpdating}
              onClick={() => handleStatusChange(s)}
            >
              Move to {s.replace("_", " ")}
            </Button>
          ))}
        </div>
      )}

      {report.resolution && (
        <div className="mb-6 flex gap-2 rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-900">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">{resolutionTypeLabels[report.resolution.type]}</p>
            <p>{report.resolution.message}</p>
          </div>
        </div>
      )}

      {/* Conversation */}
      <div className="mb-4 space-y-3 rounded-xl border bg-white p-4">
        {report.messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          report.messages.map((m) => (
            <div key={m.id} className={cn("flex", m.senderType === "ADMIN" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                m.senderType === "ADMIN" ? "bg-[#2E1F14] text-white" : "bg-[#F3EAE0] text-[#2E1F14]"
              )}>
                <p>{m.message}</p>
                <p className={cn("mt-1 text-[10px]", m.senderType === "ADMIN" ? "text-white/70" : "text-muted-foreground")}>
                  {m.senderType} · {new Date(m.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {canConverse ? (
        <>
          <div className="mb-6 flex gap-2">
            <Textarea placeholder="Reply to customer..." value={message} onChange={(e) => setMessage(e.target.value)} rows={2} className="flex-1" />
            <Button onClick={handleSend} disabled={sending || !message.trim()}>{sending ? "Sending..." : "Send"}</Button>
          </div>

          {report.status === "IN_REVIEW" && (
            <div className="rounded-md border p-4">
              <p className="mb-3 text-sm font-medium">Resolve Report</p>
              <div className="space-y-3">
                <Select value={resolutionType} onValueChange={(v) => setResolutionType(v as ResolutionType)}>
                  <SelectTrigger><SelectValue placeholder="Resolution type" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(resolutionTypeLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Explain the resolution to the customer..."
                  value={resolutionMessage}
                  onChange={(e) => setResolutionMessage(e.target.value)}
                />
                <Button onClick={handleResolve} disabled={resolving}>
                  {resolving ? "Resolving..." : "Resolve Report"}
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">This report is closed for further activity.</p>
      )}
    </div>
  );
};

export default AdminOrderReportDetail;