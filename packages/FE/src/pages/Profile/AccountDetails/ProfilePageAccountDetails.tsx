import { useRef, useState } from "react";
import { Camera, Pencil, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import config from "@/config";
import { useAuthContext } from "@/context/Auth";
import { cn, composeCdnUrl } from "@/lib/utils";
import { useSuspenseGetUser } from "@/queries/users";
import { useUpdateProfile } from "@/queries/users/mutations";
import { useUploadFile } from "@/queries/files";
import { useGetUserRecipes } from "@/queries/recipes";
import type { UploadFileResponse } from "@/queries/files/types";
import ProfilePageAccountTabsDetailsTab from "@/pages/Profile/AccountTabs/tabs/Details";

const ProfilePageAccountDetails = () => {
  const { account } = useAuthContext();
  const { data: user } = useSuspenseGetUser();
  const { data: userRecipes = [] } = useGetUserRecipes();
  const { t } = useTranslation();
  const isOwnProfile = account?.id === user.id;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFile = useUploadFile();
  const updateProfile = useUpdateProfile();

  const handleAvatarClick = () => {
    if (isOwnProfile && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !account) return;

    setUploading(true);
    try {
      const result = (await uploadFile.mutateAsync({
        file,
        category: "profile",
      })) as UploadFileResponse;

      await updateProfile.mutateAsync({
        id: account.id,
        data: { profilePicture: result.relativePath },
      });
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-start md:items-center gap-12 mb-20 p-8 bg-surface-container-low rounded-xl border border-outline-variant/50">
      <div className="relative w-40 h-40 md:w-48 md:h-48 shrink-0">
        <input
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={handleAvatarClick}
          className={cn(
            "relative w-full h-full overflow-hidden rounded-full border border-outline-variant",
            isOwnProfile && "cursor-pointer group",
          )}
        >
          <Avatar className="w-full h-full">
            <AvatarImage
              src={composeCdnUrl(config.cdnUrl, user.profilePicture)}
              className="w-full h-full object-cover"
            />
            <AvatarFallback className="w-full h-full rounded-full">
              <User className="w-16 h-16 text-on-surface-variant" />
            </AvatarFallback>
          </Avatar>
          {isOwnProfile && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-full flex items-center justify-center">
              <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>
      </div>
      <div className="flex-1 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[48px] leading-[1.1] tracking-[-0.02em] font-serif text-primary">
              {user.nickName}
            </h1>
            <p className="text-[12px] leading-[1.0] tracking-[0.2em] font-semibold text-secondary uppercase mt-1">
              Chef de Cuisine &bull; Madrid
            </p>
          </div>
          <div className="flex gap-3">
            {isOwnProfile && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all active:scale-95">
                    <Pencil className="w-4 h-4 mr-2" />
                    {t("pages.profile.editProfile")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t("pages.profile.editProfile")}</DialogTitle>
                  </DialogHeader>
                  <ProfilePageAccountTabsDetailsTab onSuccess={() => setDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            )}
            {!isOwnProfile && (
              <Button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all active:scale-95">
                Follow
              </Button>
            )}
          </div>
        </div>
        {user.description && (
          <p className="text-[18px] leading-[1.6] text-on-surface-variant max-w-2xl">
            {user.description}
          </p>
        )}
        <div className="flex gap-12 pt-4">
          <div className="flex flex-col">
            <span className="text-[24px] leading-[1.3] font-medium font-serif text-primary">
              {userRecipes.length}
            </span>
            <span className="text-[12px] leading-[1.0] tracking-[0.1em] font-semibold text-on-primary-container uppercase">
              Recetas
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[24px] leading-[1.3] font-medium font-serif text-primary">
              12.8k
            </span>
            <span className="text-[12px] leading-[1.0] tracking-[0.1em] font-semibold text-on-primary-container uppercase">
              Seguidores
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[24px] leading-[1.3] font-medium font-serif text-primary">
              850
            </span>
            <span className="text-[12px] leading-[1.0] tracking-[0.1em] font-semibold text-on-primary-container uppercase">
              Siguiendo
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePageAccountDetails;
