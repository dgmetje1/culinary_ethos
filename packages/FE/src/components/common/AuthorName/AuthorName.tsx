import { Loader2 } from "lucide-react";

import { useSuspenseGetUserSummary } from "@/queries/users";

interface AuthorNameProps {
  authorId: string;
}

const AuthorName = ({ authorId }: AuthorNameProps) => {
  const { data: user, isLoading } = useSuspenseGetUserSummary(authorId);

  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-1">
        <Loader2 className="w-3 h-3 animate-spin" />
      </span>
    );
  }

  return <>{user?.nickName || user?.name || authorId}</>;
};

export default AuthorName;
