import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";

interface Props {
  activeCategoryId: number | null;
  onChange: (categoryId: number | null) => void;
}

const CategoryFilterBar: React.FC<Props> = ({ activeCategoryId, onChange }) => {
  // Top-level categories only — matches the level-1 filter approach
  // used elsewhere; subcategories stay one click deeper (on the
  // category page itself), keeping this bar scannable.
  const { categories } = useCategories({ activeOnly: true });
  const rootCategories = categories.filter((c) => c.parentId === null);

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          activeCategoryId === null
            ? "border-[#2E1F14] bg-[#2E1F14] text-white"
            : "border-[#E8DDD0] text-[#5C4A3A] hover:bg-[#F3EAE0]"
        )}
      >
        All
      </button>
      {rootCategories.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            activeCategoryId === c.id
              ? "border-[#2E1F14] bg-[#2E1F14] text-white"
              : "border-[#E8DDD0] text-[#5C4A3A] hover:bg-[#F3EAE0]"
          )}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilterBar;