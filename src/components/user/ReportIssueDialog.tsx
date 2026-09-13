import { useState } from "react";
import toast from "react-hot-toast";
import { createOrderReport } from "@/Service/OrderReportServices";
import { extractApiErrorMessage } from "@/lib/apiError";
import { reportReasonLabels } from "@/lib/orderReportUtils";
import type { OrderReportReason } from "@/types/orderReport";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  orderId: number;
  orderNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}

const reasons: OrderReportReason[] = ["WRONG_ITEM_DELIVERED", "ORDER_NOT_RECEIVED", "POOR_PACKAGING", "LATE_DELIVERY", "OTHER"];

const ReportIssueDialog: React.FC<Props> = ({ orderId, orderNumber, open, onOpenChange, onSubmitted }) => {
  const [reason, setReason] = useState<OrderReportReason | "">("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }
    setSubmitting(true);
    try {
      await createOrderReport(orderId, { reason, description });
      toast.success("Report submitted");
      setReason("");
      setDescription("");
      onOpenChange(false);
      onSubmitted();
    } catch (err) {
      
      toast.error(extractApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Report an Issue</DialogTitle></DialogHeader>
        <p className="mb-3 text-sm text-muted-foreground">Order #{orderNumber}</p>
        <RadioGroup value={reason} onValueChange={(v) => setReason(v as OrderReportReason)} className="space-y-2">
          {reasons.map((r) => (
            <label key={r} className="flex items-center gap-3 rounded-md border p-3 text-sm has-[:checked]:border-[#2E1F14]">
              <RadioGroupItem value={r} />
              {reportReasonLabels[r]}
            </label>
          ))}
        </RadioGroup>
        <Textarea className="mt-3" placeholder="Additional details..." value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} />
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>{submitting ? "Submitting..." : "Submit Report"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIssueDialog;