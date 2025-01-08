import { Button } from "@/components/ui/button";

interface PostPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PostPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PostPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center space-x-2 mt-4">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};