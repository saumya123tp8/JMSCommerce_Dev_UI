import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "@/components/layout/Layout";
import { getOrderReportDetail, addReportMessage } from "@/Service/OrderReportServices";
import { reportReasonLabels, reportStatusBadgeVariant } from "@/lib/orderReportUtils";
import { extractApiErrorMessage } from "@/lib/apiError";
import type { OrderReportDetail } from "@/types/orderReport";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<OrderReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    getOrderReportDetail(Number(id)).then(setReport).catch(() => toast.error("Failed to load report")).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [report?.messages.length]);

  const handleSend = async () => {
    if (!id || !message.trim()) return;
    setSending(true);
    try {
      const newMsg = await addReportMessage(Number(id), { message: message.trim() });
      setReport((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev));
      setMessage("");
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Layout title="Report Details"><div className="container mx-auto px-4 py-12 text-center text-muted-foreground">Loading...</div></Layout>;
  if (!report) return null;

  const canReply = !["CLOSED", "RESOLVED", "REJECTED"].includes(report.status);

  return (
    <Layout title={`Report — ${report.orderNumber}`}>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-sm text-muted-foreground">Order #{report.orderNumber}</p>
            <h1 className="font-serif text-2xl text-[#2E1F14]">{reportReasonLabels[report.reason]}</h1>
          </div>
          <Badge variant={reportStatusBadgeVariant(report.status)}>{report.status.replace("_", " ")}</Badge>
        </div>

        {report.resolution && (
          <div className="mb-6 flex gap-2 rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-900">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <div><p className="font-medium">{report.resolution.type}</p><p>{report.resolution.message}</p></div>
          </div>
        )}

        <div className="mb-4 space-y-3 rounded-xl border border-[#E8DDD0] bg-white p-4">
          {report.messages.map((m) => (
            <div key={m.id} className={cn("flex", m.senderType === "USER" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[75%] rounded-lg px-3 py-2 text-sm",
                m.senderType === "USER" ? "bg-[#2E1F14] text-white" : "bg-[#F3EAE0] text-[#2E1F14]")}>
                <p>{m.message}</p>
                <p className={cn("mt-1 text-[10px]", m.senderType === "USER" ? "text-white/70" : "text-muted-foreground")}>
                  {new Date(m.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {canReply ? (
          <div className="flex gap-2">
            <Textarea placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1" rows={2} />
            <Button onClick={handleSend} disabled={sending || !message.trim()}>{sending ? "Sending..." : "Send"}</Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">This report is closed for further replies.</p>
        )}
      </div>
    </Layout>
  );
};

export default ReportDetailPage;