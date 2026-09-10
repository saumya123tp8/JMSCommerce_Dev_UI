// import { Link } from "react-router-dom";
// import { useCategories } from "@/hooks/useCategories";
// import { sortCategoryTree } from "@/lib/categoryUtils";
// import { Button, buttonVariants } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Plus, Pencil, ListTree, ListChecks } from "lucide-react";

// const AdminCategoryList: React.FC = () => {
//   const { categories, loading, error } = useCategories();
//   const sorted = sortCategoryTree(categories);

//   return (
//     <div className="p-6">
//       <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
//           <div>
//             <h1 className="font-serif text-3xl text-[#2E1F14]">Categories</h1>
//           </div>
//           <div className="flex gap-3">
//             <Link
//               to="/dashboard/admin/specifications"
//               className={buttonVariants({ variant: "outline" })}
//             >
//               Manage Specifications
//             </Link>
//             <Link
//               to="/dashboard/admin/categories/new"
//               className={buttonVariants()}
//             >
//               Create category
//             </Link>
//           </div>
//         </div>

//       {error && (
//         <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
//           {error}
//         </div>
//       )}

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Slug</TableHead>
//               <TableHead>Level</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-center">Manage Specification</TableHead>
//               <TableHead className="text-center">Sub-Category</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center text-muted-foreground">
//                   Loading categories...
//                 </TableCell>
//               </TableRow>
//             ) : sorted.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center text-muted-foreground">
//                   No categories yet.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               sorted.map((category) => (
//                 <TableRow key={category.id}>
//                   <TableCell>
//                     <span
//                       style={{ paddingLeft: `${(category.level - 1) * 20}px` }}
//                       className="inline-block"
//                     >
//                       {category.level > 1 && "— "}
//                       {category.name}
//                     </span>
//                   </TableCell>
//                   <TableCell className="text-muted-foreground">
//                     {category.slug}
//                   </TableCell>
//                   <TableCell>{category.level}</TableCell>
//                   <TableCell>
//                     <Badge variant={category.status === "ACTIVE" ? "default" : "secondary"}>
//                       {category.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-center">
//                     <div className="flex justify-center gap-2">
                      
//                         <Link to={`/dashboard/admin/specifications?categoryId=${category.id}`}>
//                           <ListChecks className="mr-1 h-3 w-3" />
//                         </Link>
                     
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-center">
//                     <div className="flex justify-center gap-2">
                      
//                     <Button variant="ghost" size="sm" >
//                         <Link to={`/dashboard/admin/categories/new?parentId=${category.id}`}>
//                           <ListTree className="mr-1 h-3 w-3" />
//                           Add
//                         </Link>
//                       </Button>
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
                    
//                       <Button variant="ghost" size="sm" >
//                         <Link to={`/dashboard/admin/categories/${category.id}/edit`}>
//                           <Pencil className="mr-1 h-3 w-3" />
//                           Edit
//                         </Link>
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default AdminCategoryList;


import { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import type { Category } from "@/types/category";
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
import { Plus, Pencil, ListTree, ListChecks, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminCategoryList: React.FC = () => {
  const { categories, loading, error } = useCategories();
  // Tracks which parent rows are expanded, keyed by category id.
  // Root categories start expanded by default so the tree isn't
  // fully collapsed on first load.
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const childrenOf = (parentId: number | null) =>
    categories.filter((c) => c.parentId === parentId);

  const rootCategories = childrenOf(null);

  // Recursively renders a category row, then its children rows
  // right underneath if the row is expanded.
  const renderRow = (category: Category, depth: number): React.ReactNode => {
    const children = childrenOf(category.id);
    const hasChildren = children.length > 0;
    const isExpanded = expanded.has(category.id);

    return (
      <>
        <TableRow key={category.id}>
          <TableCell>
            <div
              className="flex items-center gap-1"
              style={{ paddingLeft: `${depth * 20}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="flex h-5 w-5 items-center justify-center rounded hover:bg-muted"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                </button>
              ) : (
                <span className="w-5" />
              )}
              {category.name}
            </div>
          </TableCell>
          <TableCell className="text-muted-foreground">
            {category.slug}
          </TableCell>
          <TableCell>{category.level}</TableCell>
          <TableCell>
            <Badge variant={category.status === "ACTIVE" ? "default" : "secondary"}>
              {category.status}
            </Badge>
          </TableCell>
          <TableCell className="text-center">
            <Link
              to="/dashboard/admin/specifications"
              className="inline-flex items-center justify-center"
            >
              <ListChecks className="h-4 w-4" />
            </Link>
          </TableCell>
          <TableCell className="text-center">
            {(category.level != 4)&&(
            <Button variant="ghost" size="sm" >
              <Link to={`/dashboard/admin/categories/new?parentId=${category.id}`}>
                <ListTree className="mr-1 h-3 w-3" />
                Add..
              </Link>
            </Button>)}
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm" >
              <Link to={`/dashboard/admin/categories/${category.id}/edit`}>
                <Pencil className="mr-1 h-3 w-3" />
                Edit
              </Link>
            </Button>
          </TableCell>
        </TableRow>

        {hasChildren &&
          isExpanded &&
          children.map((child) => renderRow(child, depth + 1))}
      </>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#2E1F14]">Categories</h1>
        </div>
        <div className="flex gap-3">
          <Link
            to="/dashboard/admin/specifications"
            className={buttonVariants({ variant: "outline" })}
          >
            Manage Specifications
          </Link>
          <Link
            to="/dashboard/admin/categories/new"
            className={buttonVariants()}
          >
            Create category
          </Link>
        </div>
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
              <TableHead>Slug</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Manage Specification</TableHead>
              <TableHead className="text-center">Sub-Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Loading categories...
                </TableCell>
              </TableRow>
            ) : rootCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No categories yet.
                </TableCell>
              </TableRow>
            ) : (
              rootCategories.map((category) => renderRow(category, 0))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCategoryList;