import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name: A to Z" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export interface ProductFilterValues {
  minPrice: string;
  maxPrice: string;
  minRating: string;
  saleOnly: boolean;
  inStock: boolean;
  sort: SortValue;
}

interface ProductFilterBarProps {
  values: ProductFilterValues;
  onChange: (values: ProductFilterValues) => void;
  onClear: () => void;
}

const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  values,
  onChange,
  onClear,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = <K extends keyof ProductFilterValues>(
    key: K,
    value: ProductFilterValues[K]
  ) => {
    onChange({
      ...values,
      [key]: value,
    });
  };

  const filterContent = (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
      {/* Min price */}
      <div className="min-w-0 flex-1">
        <Label
          htmlFor="filter-min-price"
          className="mb-1.5 block text-xs text-muted-foreground"
        >
          Min price
        </Label>

        <Input
          id="filter-min-price"
          type="number"
          min="0"
          inputMode="numeric"
          placeholder="Min"
          value={values.minPrice}
          onChange={(e) => update("minPrice", e.target.value)}
        />
      </div>

      {/* Max price */}
      <div className="min-w-0 flex-1">
        <Label
          htmlFor="filter-max-price"
          className="mb-1.5 block text-xs text-muted-foreground"
        >
          Max price
        </Label>

        <Input
          id="filter-max-price"
          type="number"
          min="0"
          inputMode="numeric"
          placeholder="Max"
          value={values.maxPrice}
          onChange={(e) => update("maxPrice", e.target.value)}
        />
      </div>

      {/* Rating */}
      <div className="min-w-0 flex-1">
        <Label className="mb-1.5 block text-xs text-muted-foreground">
          Rating
        </Label>

        <Select
          value={values.minRating || "any"}
          onValueChange={(value) =>
            update(
              "minRating",
              !value || value === "any" ? "" : value
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="any">Any rating</SelectItem>
            <SelectItem value="4">4★ and above</SelectItem>
            <SelectItem value="3">3★ and above</SelectItem>
            <SelectItem value="2">2★ and above</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sale */}
      <label className="flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-[#E8DDD0] px-3">
        <Checkbox
          checked={values.saleOnly}
          onCheckedChange={(checked) =>
            update("saleOnly", checked === true)
          }
        />

        <span className="whitespace-nowrap text-sm text-[#2E1F14]">
          On sale
        </span>
      </label>

      {/* In stock */}
      <label className="flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-[#E8DDD0] px-3">
        <Checkbox
          checked={values.inStock}
          onCheckedChange={(checked) =>
            update("inStock", checked === true)
          }
        />

        <span className="whitespace-nowrap text-sm text-[#2E1F14]">
          In stock
        </span>
      </label>

      {/* Sort */}
      <div className="min-w-0 flex-1">
        <Label className="mb-1.5 block text-xs text-muted-foreground">
          Sort
        </Label>

        <Select
          value={values.sort}
          onValueChange={(value) =>
            update("sort", value as SortValue)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onClear}
      >
        Clear
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden rounded-2xl border border-[#E8DDD0] bg-white p-4 lg:block">
        {filterContent}
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setMobileOpen(true)}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters & Sort
        </Button>

        {mobileOpen && (
          <div className="fixed inset-0 z-[60]">
            <button
              type="button"
              aria-label="Close filters"
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileOpen(false)}
            />

            <aside className="absolute inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl bg-white p-5 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-serif text-xl text-[#2E1F14]">
                  Filters & Sort
                </h2>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setMobileOpen(false)}
                >
                  Close
                </Button>
              </div>

              <div className="max-h-[65dvh] overflow-y-auto">
                {filterContent}
              </div>

              <Button
                type="button"
                className="mt-5 w-full"
                onClick={() => setMobileOpen(false)}
              >
                Apply filters
              </Button>
            </aside>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductFilterBar;