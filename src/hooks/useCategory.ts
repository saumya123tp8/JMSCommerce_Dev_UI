import { useEffect } from "react";
import { useAppDispatch, useAppSelector as useReduxSelector } from "../redux/hooks/index"; // your typed hooks  
import type { Category } from "../types/category";

const useCategory = () => {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useReduxSelector(
    (state) => state.categorySlice.categories as Category[],
    (state) => state.categorySlice.loading as boolean,
    (state) => state.categorySlice.error as string | null
  );
  return { categories, loading, error };
};
export default useCategory;