import Layout from "@/components/layout/Layout";
import PolicyLayout from "@/components/legal/PolicyLayout";

const ShippingInfo = () => {
  return (
    <Layout>
      <PolicyLayout
        label="Store policies"
        title="Shipping information"
        updated="September 2026"
        intro="Everything you need to know about how and when your order arrives."
        sections={[
          {
            id: "processing",
            heading: "Processing time",
            content: [
              "Orders are packed and handed to the carrier within 1–2 business days. During sale periods this can extend to 3 business days — we'll flag it at checkout if so.",
              "You'll get a confirmation email the moment your order ships, with a tracking link attached.",
            ],
          },
          {
            id: "delivery",
            heading: "Delivery windows",
            content: [
              "Standard shipping typically arrives in 4–6 business days. Expedited shipping arrives in 1–3 business days. Exact timing depends on your delivery address and the carrier's route.",
            ],
          },
          {
            id: "international",
            heading: "International orders",
            content: [
              "We ship to most countries. International orders may be subject to customs duties and import taxes set by your local government — these are the buyer's responsibility and aren't included in the order total.",
            ],
          },
          {
            id: "tracking",
            heading: "Tracking your order",
            content: [
              "Every shipment includes a tracking number. If tracking hasn't updated in 5 business days, reach out to support and we'll investigate with the carrier directly.",
            ],
          },
          {
            id: "issues",
            heading: "Lost or delayed packages",
            content: [
              "If your package is marked delivered but hasn't arrived, check with neighbors and your building office first — carriers occasionally misdeliver. If it's still missing after 48 hours, contact support and we'll open a claim.",
            ],
          },
        ]}
      />
    </Layout>
  );
};

export default ShippingInfo;