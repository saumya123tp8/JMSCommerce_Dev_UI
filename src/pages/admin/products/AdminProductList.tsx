import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
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
import { Plus, Pencil, Package } from "lucide-react";

const AdminProductList: React.FC = () => {
  const { products, loading, error } = useProducts();

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl text-[#2E1F14]">Products</h1>
        <Link to="/dashboard/admin/products/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Create product
        </Link>
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
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Variants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No products yet.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="flex items-center gap-3">
                    <img
                      src={product.primaryImage}
                      alt={product.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    {product.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.brandName}
                  </TableCell>
                  <TableCell>
                    {product.currency} {product.sellingPrice}
                    {product.sellingPrice !== product.mrp && (
                      <span className="ml-2 text-xs text-muted-foreground line-through">
                        {product.mrp}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "ACTIVE"
                          ? "default"
                          : product.status === "DRAFT"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                  
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/dashboard/admin/products/${product.id}/variants`}>
                          <Package className="mr-1 h-3 w-3" />
                          Variants
                        </Link>
                      </Button>
                      
                    
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                     
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/dashboard/admin/products/${product.id}/edit`}>
                          <Pencil className="mr-1 h-3 w-3" />
                          Edit
                        </Link>
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

export default AdminProductList;