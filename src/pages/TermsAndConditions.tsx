import Layout from "@/components/layout/Layout";
import PolicyLayout from "@/components/legal/PolicyLayout";

const TermsAndConditions = () => {
  return (
    <Layout>
      <PolicyLayout
        label="Store policies"
        title="Terms and conditions"
        updated="September 2026"
        intro="The rules that govern your use of this site and any purchases made through it."
        sections={[
          {
            id: "acceptance",
            heading: "Acceptance of terms",
            content: [
              "By creating an account or placing an order, you agree to these terms. If you don't agree with any part of them, please don't use the site.",
            ],
          },
          {
            id: "accounts",
            heading: "Your account",
            content: [
              "You're responsible for keeping your login credentials secure and for any activity under your account. Let us know immediately if you suspect unauthorized access.",
            ],
          },
          {
            id: "orders",
            heading: "Orders and payment",
            content: [
              "Placing an order is an offer to buy. We may cancel or refuse any order — for example if an item is out of stock or pricing was listed in error — and you'll be notified and refunded in full.",
              "Prices are shown in your local currency where available and can change without notice, though confirmed orders keep the price you paid.",
            ],
          },
          {
            id: "ip",
            heading: "Intellectual property",
            content: [
              "All content on this site — product photography, descriptions, logos, and design — belongs to us or our licensors and can't be reused without permission.",
            ],
          },
          {
            id: "liability",
            heading: "Limitation of liability",
            content: [
              "We aren't liable for indirect or incidental damages arising from your use of the site, to the extent permitted by law. Nothing here limits rights you have that can't be waived under applicable consumer protection law.",
            ],
          },
          {
            id: "changes",
            heading: "Changes to these terms",
            content: [
              "We may update these terms as the store evolves. Material changes will be reflected here with a new date — continued use after that means you accept the update.",
            ],
          },
        ]}
      />
    </Layout>
  );
};

export default TermsAndConditions;