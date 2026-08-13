import type { FC } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CategoryTreeNode } from "@/types/category";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: CategoryTreeNode;
  showStatus?: boolean;
  className?: string;
}

const CategoryCard: FC<CategoryCardProps> = ({
  category,
  showStatus = false,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden border-[#E8DDD0]", className)}>
      <CardContent className="p-0">
        <Link
          to={`/category/${category.slug}`}
          className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-[#FAF7F2]"
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg text-[#2E1F14]">
                {category.name}
              </h3>
              {showStatus && (
                <Badge
                  variant={category.status === "ACTIVE" ? "default" : "secondary"}
                >
                  {category.status}
                </Badge>
              )}
            </div>
            {category.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {category.description}
              </p>
            )}
            <p className="mt-2 text-xs uppercase tracking-wide text-[#C9A96E]">
              Level {category.level}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        {category.children.length > 0 && (
          <div className="border-t border-[#E8DDD0] bg-[#FAF7F2]/60">
            {category.children.map((child) => (
              <Link
                key={child.id}
                to={`/category/${child.slug}`}
                className="flex items-center justify-between border-b border-[#E8DDD0]/70 px-5 py-3 pl-8 text-sm last:border-b-0 hover:bg-white"
              >
                <span className="text-[#2E1F14]">{child.name}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
