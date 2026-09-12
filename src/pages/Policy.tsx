import Layout from "@/components/layout/Layout";
import PolicyLayout from "@/components/legal/PolicyLayout";

const Policy = () => {
  return (
    <Layout>
      <PolicyLayout
        label="Store policies"
        title="Privacy policy"
        updated="September 2026"
        intro="How we collect, use, and protect the information you share with us."
        sections={[
          {
            id: "collect",
            heading: "Information we collect",
            content: [
              "We collect what's needed to process orders and run your account: name, shipping and billing address, email, and order history. Payment details are handled directly by our payment processor — we never store your full card number.",
            ],
          },
          {
            id: "use",
            heading: "How we use it",
            content: [
              "Your information is used to fulfill orders, send order updates, and respond to support requests. With your consent, we may also send product updates or promotions — you can opt out at any time.",
            ],
          },
          {
            id: "sharing",
            heading: "Sharing with third parties",
            content: [
              "We share only what's necessary with trusted partners — shipping carriers to deliver your order, and payment processors to complete transactions. We don't sell your personal data.",
            ],
          },
          {
            id: "security",
            heading: "Data retention and security",
            content: [
              "We keep account and order data for as long as your account is active, and use industry-standard safeguards to protect it. Data tied to closed accounts is deleted or anonymized after a retention period required for tax and accounting purposes.",
            ],
          },
          {
            id: "rights",
            heading: "Your rights",
            content: [
              "You can request a copy of your data, ask us to correct it, or request deletion at any time. Some information may need to be retained where required by law, such as completed order records.",
            ],
          },
        ]}
      />
    </Layout>
  );
};

export default Policy;