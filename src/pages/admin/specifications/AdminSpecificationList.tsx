import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCategories } from "@/hooks/useCategories";
import { useSpecifications } from "@/hooks/useSpecifications";
import { deleteSpecification } from "@/Service/SpecificationServices";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

const AdminSpecificationList: React.FC = () => {
  const { categories } = useCategories();
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const { specifications, loading, error, refetch } = useSpecifications({
    categoryId,
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this specification?")) return;
    try {
      await deleteSpecification(id);
      await refetch();
      // Backend currently returns success without actually deleting
      // (see API doc) — flag this rather than silently trust it worked.
      toast(
        "Delete requested — a known backend issue may prevent it from actually being removed yet.",
        { icon: "⚠️" }
      );
    } catch {
      toast.error("Failed to delete specification");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Specifications</h1>
        <Button >
          <Link to="/dashboard/admin/specifications/new">
            <Plus className="mr-2 h-4 w-4" />
            New Specification
          </Link>
        </Button>
      </div>

      <div className="mb-4 max-w-xs">
        <Select
          onValueChange={(val) => setCategoryId(val === "all" ? undefined : Number(val))}
          value={categoryId ? String(categoryId) : "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
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
              <TableHead>Display Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading specifications...
                </TableCell>
              </TableRow>
            ) : specifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No specifications found.
                </TableCell>
              </TableRow>
            ) : (
              specifications.map((spec) => (
                <TableRow key={spec.id}>
                  <TableCell>{spec.displayName}</TableCell>
                  <TableCell className="text-muted-foreground">{spec.categoryName}</TableCell>
                  <TableCell>{spec.dataType}</TableCell>
                  <TableCell>{spec.unit ?? "—"}</TableCell>
                  <TableCell className="space-x-1">
                    {spec.required && <Badge variant="secondary">Required</Badge>}
                    {spec.filterable && <Badge variant="outline">Filterable</Badge>}
                    {spec.searchable && <Badge variant="outline">Searchable</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" >
                        <Link to={`/dashboard/admin/specifications/${spec.id}/edit`}>
                          <Pencil className="mr-1 h-3 w-3" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(spec.id)}>
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

export default AdminSpecificationList;