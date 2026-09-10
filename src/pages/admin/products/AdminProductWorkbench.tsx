import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import CategoryCascadeSelector from "@/components/admin/CategoryCascadeSelector";
import ProductWorkbenchSidebar from "@/components/admin/ProductWorkbenchSidebar";
import ProductWorkbenchForm from "@/components/admin/workbench/ProductWorkbenchForm";
import VariantWorkbenchForm from "@/components/admin/workbench/VariantWorkbenchForm";
import CustomizationWorkbenchPanel from "@/components/admin/workbench/CustomizationWorkbenchPanel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Mode = "empty" | "prompt" | "create-product" | "edit-product" | "variant-form" | "customization-form";

const AdminProductWorkbench: React.FC = () => {
  const { categories } = useCategories();
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("empty");
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
  const [activeVariantId, setActiveVariantId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const bumpRefresh = () => setRefreshKey((k) => k + 1);

  // Any mode beyond prompt/empty represents unsaved in-progress
  // work — guard switching away from it.
  const confirmDiscard = () =>
    mode === "prompt" || mode === "empty" || window.confirm("Discard unsaved changes?");

  const handleCategoryChange = (id: number | null) => {
    if (!confirmDiscard()) return;
    setCategoryId(id);
    setMode(id ? "prompt" : "empty");
    setActiveProductId(null);
    setActiveVariantId(null);
  };

  const startCreateProduct = () => {
    if (!confirmDiscard()) return;
    setActiveProductId(null);
    setMode("create-product");
  };

  const startEditProduct = (productId: number) => {
    if (!confirmDiscard()) return;
    setActiveProductId(productId);
    setMode("edit-product");
  };

  const startAddVariant = (productId: number) => {
    if (!confirmDiscard()) return;
    setActiveProductId(productId);
    setActiveVariantId(null);
    setMode("variant-form");
  };

  const startEditVariant = (productId: number, variantId: number) => {
    if (!confirmDiscard()) return;
    setActiveProductId(productId);
    setActiveVariantId(variantId);
    setMode("variant-form");
  };

  const startManageCustomization = (productId: number) => {
    if (!confirmDiscard()) return;
    setActiveProductId(productId);
    setMode("customization-form");
  };

  const backToPrompt = () => {
    setMode("prompt");
    setActiveProductId(null);
    setActiveVariantId(null);
  };

  const selectedCategory = categoryId ? categories.find((c) => c.id === categoryId) : null;

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Products</h1>

      <div className="mb-6">
        <CategoryCascadeSelector categories={categories} value={categoryId} onChange={handleCategoryChange} />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="min-w-0 rounded-md border bg-white p-4 lg:col-span-2">
          {mode === "empty" && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Select a category above to get started.
            </p>
          )}

          {mode === "prompt" && selectedCategory && (
            <div className="py-12 text-center">
              <Button onClick={startCreateProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Create Product in {selectedCategory.name}
              </Button>
            </div>
          )}

          {(mode === "create-product" || mode === "edit-product") && categoryId && selectedCategory && (
            <ProductWorkbenchForm
              categoryId={categoryId}
              category={selectedCategory}
              productId={mode === "edit-product" ? activeProductId : null}
              onSaved={(productId, wasCreate) => {
                bumpRefresh();
                if (wasCreate) {
                  // New products need a variant to go ACTIVE — jump
                  // straight into variant creation for it.
                  setActiveProductId(productId);
                  setActiveVariantId(null);
                  setMode("variant-form");
                } else {
                  backToPrompt();
                }
              }}
              onCancel={backToPrompt}
            />
          )}

          {mode === "variant-form" && activeProductId && (
            <VariantWorkbenchForm
              productId={activeProductId}
              variantId={activeVariantId}
              onSaved={() => {
                bumpRefresh();
                // Stay put for rapid entry of the next variant combo
                // rather than bouncing back to the prompt each time.
              }}
              onCancel={backToPrompt}
            />
          )}

          {mode === "customization-form" && activeProductId && (
            <CustomizationWorkbenchPanel
              productId={activeProductId}
              onSaved={() => {
                bumpRefresh();
                backToPrompt();
              }}
              onCancel={backToPrompt}
            />
          )}
        </div>

        <aside className="min-w-0 lg:col-span-1">
          <div className="sticky top-6 rounded-md border bg-white p-3">
            <ProductWorkbenchSidebar
              categoryId={categoryId}
              refreshKey={refreshKey}
              activeProductId={activeProductId}
              onCreateProduct={startCreateProduct}
              onEditProduct={startEditProduct}
              onAddVariant={startAddVariant}
              onEditVariant={startEditVariant}
              onManageCustomization={startManageCustomization}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminProductWorkbench;