import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import config from "@/config";
import { composeCdnUrl } from "@/lib/utils";
import { useSuspenseGetUser } from "@/queries/users";

const ProfilePageAccountDetails = () => {
  const { data: user } = useSuspenseGetUser();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", padding: "0.75rem 0" }}>
      <Avatar className="h-24 w-24">
        <AvatarImage src={composeCdnUrl(config.cdnUrl, user.profilePicture)} />
        <AvatarFallback>
          <User className="w-8 h-8" />
        </AvatarFallback>
      </Avatar>
      <div style={{ display: "flex", flexDirection: "column", rowGap: "0.25rem" }}>
        <h1 style={{ fontWeight: 700, fontSize: "1.5rem" }}>{user.nickName}</h1>
        <Button size="sm" variant="outline">
          Follow
        </Button>
      </div>
    </div>
  );
};

export default ProfilePageAccountDetails;
