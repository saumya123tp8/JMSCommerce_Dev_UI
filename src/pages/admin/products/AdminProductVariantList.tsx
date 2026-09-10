import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllVariants, deleteVariant } from "@/Service/VariantServices";
import { extractApiErrorMessage } from "@/lib/apiError";
import type { Variant } from "@/types/variant";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

const AdminProductVariantList: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVariants = async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const data = await getAllVariants(Number(productId));
      setVariants(data);
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleDelete = async (variantId: number) => {
    if (!productId) return;
    if (!confirm("Delete this variant?")) return;
    try {
      await deleteVariant(Number(productId), variantId);
      toast.success("Variant deleted");
      fetchVariants();
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl text-[#2E1F14]">Variants</h1>
        <Link
          to={`/dashboard/admin/products/${productId}/variants/new`}
          className={buttonVariants()}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add variant
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variant</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading variants...
                </TableCell>
              </TableRow>
            ) : variants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No variants yet — this product will stay in DRAFT until one is added.
                </TableCell>
              </TableRow>
            ) : (
              variants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell>
                    {/* Attribute names shown, not specificationDefinitionId */}
                    {variant.displayName}
                  </TableCell>
                  <TableCell>{variant.sellingPrice}</TableCell>
                  <TableCell>{variant.stock}</TableCell>
                  <TableCell className="text-muted-foreground">{variant.sku}</TableCell>
                  <TableCell>
                    <Badge variant={variant.active ? "default" : "secondary"}>
                      {variant.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Link
                          to={`/dashboard/admin/products/${productId}/variants/${variant.id}/edit`}
                        >
                          <Pencil className="mr-1 h-3 w-3" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(variant.id)}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
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

export default AdminProductVariantList;