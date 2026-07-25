import { useState } from "react";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/context/Auth";
import { useSuspenseGetUser } from "@/queries/users";
import { useUpdateProfile, type ProfileUpdateData } from "@/queries/users/mutations";
import { languages } from "@/types/user";

type Props = {
  onSuccess?: () => void;
};

const ProfilePageAccountTabsDetailsTab = ({ onSuccess }: Props) => {
  const { account } = useAuthContext();
  const { data: user } = useSuspenseGetUser();
  const { t } = useTranslation();
  const [form, setForm] = useState<ProfileUpdateData>({
    nickName: user.nickName,
    language: user.language,
    description: user.description ?? '',
  });
  const updateProfile = useUpdateProfile();

  const isOwnProfile = account?.id === user.id;
  if (!isOwnProfile) return null;

  const handleSave = async () => {
    if (!account) return;
    await updateProfile.mutateAsync({ id: account.id, data: form });
    onSuccess?.();
  };

  const handleReset = () => {
    setForm({
      nickName: user.nickName,
      language: user.language,
      description: user.description ?? '',
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-stone-500">{t("pages.profile.fields.nickName")}</label>
        <Input
          value={form.nickName}
          onChange={(e) => setForm({ ...form, nickName: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-stone-500">{t("pages.profile.fields.language")}</label>
        <Select
          value={form.language}
          onValueChange={(value) => setForm({ ...form, language: value as ProfileUpdateData["language"] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {t(`languages.${lang}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium text-stone-500">{t('pages.profile.fields.description')}</label>
        <Textarea
          value={form.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })}
          rows={4}
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button size="sm" onClick={handleSave} disabled={updateProfile.isPending}>
          <Check className="w-4 h-4 mr-1" />
          {t("common.save")}
        </Button>
        <Button size="sm" variant="outline" onClick={handleReset}>
          <X className="w-4 h-4 mr-1" />
          {t("common.cancel")}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePageAccountTabsDetailsTab;
