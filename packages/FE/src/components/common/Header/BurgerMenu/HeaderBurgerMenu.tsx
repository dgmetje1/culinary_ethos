import { useState } from "react";
import { Menu as MenuIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import Menu from "@/components/common/Menu";
import { Api } from "@/lib/api";
import { queryClient } from "@/lib/core/queryClient";
import { Language, languages } from "@/types/user";

const HeaderBurgerMenu = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const toggleMenu = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const currentLanguage = i18n.language;

  const onChangeLanguage = (language: Language) => {
    if (currentLanguage === language) return;

    i18n.changeLanguage(language);
    Api.setLanguage(language);
    queryClient.invalidateQueries();
    setOpen(false);
  };

  return (
    <>
      <button aria-label="menu" onClick={toggleMenu(true)} className="p-2 rounded-md hover:bg-stone-100">
        <MenuIcon className="w-6 h-6" />
      </button>
      <Menu defaultTab={0} open={open} toggleMenu={toggleMenu}>
        <div style={{ display: "flex", justifyContent: "space-evenly", margin: "0.5rem 1rem", marginTop: "0.75rem" }}>
          {languages.map(language => (
            <Button
              key={language}
              onClick={() => onChangeLanguage(language)}
              variant={currentLanguage === language ? "default" : "outline"}
              className="font-semibold"
            >
              {language}
            </Button>
          ))}
        </div>
      </Menu>
    </>
  );
};

export default HeaderBurgerMenu;
