import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  import type { ProductSpecificationValue } from "@/types/product";
  import type { CustomizationGroup } from "@/types/customization";
  
  interface Props {
    specs: ProductSpecificationValue[];
    groups: CustomizationGroup[];
  }
  
  // Delivery Instructions, Return Policy, and Storage Information have
  // NO backend data source in any documented API — shown as static
  // placeholder text. If these should be per-product/per-category
  // editable content, that needs a real backend field; see
  // requirements list.
  const ProductInfoAccordion: React.FC<Props> = ({ specs, groups }) => {
    return (
    //   <Accordion type="single" collapsible className="mt-14 max-w-2xl">
    <Accordion  className="mt-14 max-w-2xl">
        <AccordionItem value="details">
          <AccordionTrigger>📋 Product Details</AccordionTrigger>
          <AccordionContent>
            {specs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No additional details for this product.</p>
            ) : (
              <div className="space-y-1">
                {specs.map((s) => (
                  <div key={s.specificationId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{s.specificationName}</span>
                    <span className="text-[#2E1F14]">
                      {s.value}
                      {/* {s.unit ? ` ${s.unit}` : ""} */}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
  
        <AccordionItem value="delivery">
          <AccordionTrigger>🚚 Delivery Instructions</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              Freshly prepared and delivered hot/cold as ordered. Estimated delivery time is shown
              at checkout based on your address.
            </p>
          </AccordionContent>
        </AccordionItem>
  
        <AccordionItem value="returns">
          <AccordionTrigger>🔄 Return Policy</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              Being a freshly prepared food/beverage item, this product isn't eligible for returns.
              If your order arrives incorrect or damaged, contact support for a replacement or refund.
            </p>
          </AccordionContent>
        </AccordionItem>
  
        {groups.length > 0 && (
          <AccordionItem value="customizations">
            <AccordionTrigger>✨ Customization Options</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {groups.map((g) => (
                  <div key={g.id}>
                    <p className="text-sm font-medium text-[#2E1F14]">
                      {g.name}{" "}
                      <span className="font-normal text-muted-foreground">
                        ({g.selectionType === "SINGLE" ? "choose one" : `choose up to ${g.maxSelection}`})
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {g.options.map((o) => o.name).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
  
        <AccordionItem value="storage">
          <AccordionTrigger>📦 Storage Information</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              Best enjoyed fresh. Not intended for storage — consume shortly after delivery for the
              best taste and quality.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };
  
  export default ProductInfoAccordion;