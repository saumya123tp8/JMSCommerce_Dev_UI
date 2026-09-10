import CategoryCascadeBrowser from "./CategoryCascadeBrowser";
import type { Category } from "@/types/category";

interface Props {
  categories: Category[];
  value: number | null;
  onChange: (categoryId: number | null) => void;
}

const CategoryCascadeSelector: React.FC<Props> = ({ categories, value, onChange }) => (
  <CategoryCascadeBrowser categories={categories} value={value} onChange={onChange} />
);

export default CategoryCascadeSelector;