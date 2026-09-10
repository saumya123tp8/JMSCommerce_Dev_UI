import { useState } from "react";
import { ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

interface Props {
  categories: Category[];
  value: number | null;
  onChange: (categoryId: number | null) => void;
  /** Optional content rendered to the right of the columns, e.g.
   * existing products, category actions, etc. Receives the
   * currently selected category id so it can fetch/react to it. */
  sidePanel?: (selectedCategoryId: number | null) => React.ReactNode;
  /** Width of the category-column area when a sidePanel is
   * provided. Ignored if sidePanel is omitted (columns take full
   * width). Defaults to "2/3". */
  columnsWidthClass?: string;
  /** Footer hint text shown only when nothing is selected yet. */
  helperText?: string;
}

const CategoryCascadeBrowser: React.FC<Props> = ({
  categories,
  value,
  onChange,
  sidePanel,
  columnsWidthClass = "w-2/3",
  helperText = "Browse categories left to right — pick any level, even if it has subcategories.",
}) => {
  const childrenOf = (parentId: number | null) =>
    categories.filter((c) => c.parentId === parentId);

  const buildPathTo = (id: number): number[] => {
    const path: number[] = [];
    let current = categories.find((c) => c.id === id);
    while (current) {
      path.unshift(current.id);
      current = current.parentId ? categories.find((c) => c.id === current!.parentId) : undefined;
    }
    return path;
  };

  const [path, setPath] = useState<number[]>(value ? buildPathTo(value) : []);

  const columns: { parentId: number | null }[] = [{ parentId: null }];
  path.forEach((id) => {
    if (childrenOf(id).length > 0) columns.push({ parentId: id });
  });

  const selectAt = (level: number, categoryId: number) => {
    const newPath = [...path.slice(0, level), categoryId];
    setPath(newPath);
    onChange(categoryId);
  };

  const reset = () => {
    setPath([]);
    onChange(null);
  };

  const selectedCategory = value ? categories.find((c) => c.id === value) : null;
  const hasAnyColumns = columns.some((col) => childrenOf(col.parentId).length > 0);

  return (
    <div className="rounded-md border">
      {selectedCategory && (
        <div className="flex items-center justify-between border-b bg-[#F3EAE0] px-3 py-2">
          <div className="flex items-center gap-1 text-sm text-[#2E1F14]">
            {path.map((id, idx) => (
              <span key={id} className="flex items-center gap-1">
                {idx > 0 && <ChevronRight className="h-3 w-3" />}
                {categories.find((c) => c.id === id)?.name}
              </span>
            ))}
          </div>
          <button onClick={reset} className="text-xs text-muted-foreground underline">
            Change
          </button>
        </div>
      )}

      <div className="flex">
        <div
          className={cn(
            "flex divide-x overflow-x-auto",
            sidePanel ? `${columnsWidthClass} border-r` : "w-full"
          )}
        >
          {columns.map((col, level) => {
            const items = childrenOf(col.parentId);
            if (items.length === 0) return null;

            return (
              <div key={level} className="max-h-72 min-w-[10rem] flex-1 overflow-y-auto p-1">
                {items.map((cat) => {
                  const isSelected = path[level] === cat.id;
                  const hasChildren = childrenOf(cat.id).length > 0;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => selectAt(level, cat.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded px-2 py-2 text-left text-sm transition-colors",
                        isSelected
                          ? "bg-[#2E1F14] text-white"
                          : "text-[#5C4A3A] hover:bg-[#F3EAE0]"
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        {isSelected && !hasChildren && <Check className="h-3.5 w-3.5" />}
                        {cat.name}
                      </span>
                      {hasChildren && (
                        <ChevronRight
                          className={cn("h-3.5 w-3.5", isSelected ? "text-white" : "text-muted-foreground")}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
          {!hasAnyColumns && (
            <p className="p-3 text-xs text-muted-foreground">No categories available.</p>
          )}
        </div>

        {sidePanel && (
          <div className="w-1/3 min-w-[12rem] max-h-72 overflow-y-auto p-2">
            {sidePanel(value)}
          </div>
        )}
      </div>

      {!selectedCategory && (
        <p className="border-t px-3 py-2 text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

export default CategoryCascadeBrowser;