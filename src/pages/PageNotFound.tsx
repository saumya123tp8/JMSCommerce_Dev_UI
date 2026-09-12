import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PageNotFound = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="text-lg font-medium">Page Not Found</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Button >
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  );
};

export default PageNotFound;