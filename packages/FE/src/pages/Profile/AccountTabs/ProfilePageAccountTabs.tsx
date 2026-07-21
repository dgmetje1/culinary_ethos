import Tabs, { Tab, TabContent, TabsHeader } from "@/components/common/Tabs";

const recipes = [
  {
    title: "Ensalada de Estación con Vinagreta de Cítricos",
    meta: "25 MIN • DIFICULTAD MEDIA",
    rating: "4.9",
    featured: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_xnNWiATIUlGNSwsLwo8-bffOB47s0jmXngYLTHE88XczlphQPZq8WNca7s5bfka-YoEsaWNeAcI5IFEde84mN5jWa6fMGkhcgBqEHKm61lcy63shvNPiEhTusEF9PEGYJfJO9AZGCYxtZlRD3Uf01ylLgg89H7VebAHuGCZm7cJWgeWcONoivc18XUuaLWKFry5-HIa6PyR-1uMqH77Hs0omo7Wvna3wXxq0JxvUnXLh4SxCTAkQw8KdADRa4hJsP-xNf0-pPCo",
  },
  {
    title: "Bowl Mediterráneo",
    meta: "15 MIN • FÁCIL",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKtXxJfNBLNootP1jF-U7IofOm9DAEa0iDCgrWnkMVpkn4q5ZXhhrQ_nFPcoO7iNwoY2qnyw0WAVWrEJwcWNbXu3LfHNRR-sw_xTANfzndUBKVyfJamNBuXpb8A2esy2xy4vksUZnwgdsuR5vGayJuq7e1rbatlbDzuTur1CtWgu4dxGOlcTHGHE6xYNvhj7PYOZwkBdZRUS3Z9HuNF4cO5XdF4MzSBn_qF8XHKPePUkPG6Nu3SQqmFCgoVP8B61qpEjq5BqiDLMY",
  },
  {
    title: "Crema de Calabaza Ahumada",
    meta: "40 MIN • DIFICULTAD MEDIA",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBck9v8VYxIPea8a3ROMuMeuHajS6kFcbpFhzCrsfxlnVaEMSqAur9eYxc9ZpZkOC5bju4uW2P8IuX7rQM0ORDtktosW5JVpFAEh33_Nu48CNVjsofdZ7P3w5eJUXCB3oysDGXH2s7_11h_NjI0a__Hj64Y87GVE_XSC9O7DX6em_92wVkaaeOJ0wIN0-nAvCXWpel0sMHMX0lQgyXALz6tPrYiApuh7fzpurendNeQyVRPiSXk3q29FkhzoI51WJIGq5cIiUNcd3o",
  },
  {
    title: "Salmón al Horno con Hierbas Finas",
    meta: "30 MIN • FÁCIL",
    rating: "5.0",
    featured: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvHlJmCWSw9Z9ufvnCTCoU5NAxMSpebsBa3zwK0hez8iQFqE2o-nTMfpnmAtITPn4ve3xgKc_sczXBrh7aUo5y_vIjST2dOkb6bxoBzjjmKNg4aTZHFNpct2frzSjSuCoY1ZSo37_oW4ZcfUpjuQ4wnaxWoGeSg052Cti0RfDGJxaRSQbGxBvIlOoJC0aeM79ZGO3T7eu0dN8BVi3W7lzC_XjHvswJqcYVNkLy0TZ7RDM9kejbrq92m0jFJi1h4BU7XTVpOUCDOag",
  },
];

const ProfilePageAccountTabs = () => {
  return (
    <Tabs defaultIndex={0}>
      <TabsHeader>
        <Tab label="Mis Recetas" />
        <Tab label="Colecciones Guardadas" />
      </TabsHeader>
      <TabContent contentIndex={0}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
          {recipes.map((recipe, i) => {
            const isLarge = recipe.featured;
            return (
              <div
                key={i}
                className={`${isLarge ? "md:col-span-8" : "md:col-span-4"} group cursor-pointer`}
              >
                <div
                  className={`relative mb-4 overflow-hidden rounded-xl bg-surface-container shadow-sm ${
                    isLarge ? "aspect-[16/9]" : "aspect-[4/5]"
                  }`}
                >
                  <img
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={recipe.image}
                  />
                  <div className="absolute top-4 right-4 p-2 bg-white/40 backdrop-blur-md rounded-full shadow-sm">
                    <span className="material-symbols-outlined text-primary text-xl block leading-none">
                      bookmark
                    </span>
                  </div>
                </div>
                <div
                  className={`flex justify-between items-start ${isLarge ? "px-2" : "px-2"}`}
                >
                  <div>
                    <h3 className="text-[24px] leading-[1.3] font-medium font-serif text-primary mb-1">
                      {recipe.title}
                    </h3>
                    <p className="text-[12px] leading-[1.0] tracking-[0.1em] font-semibold text-on-primary-container uppercase">
                      {recipe.meta}
                    </p>
                  </div>
                  {recipe.rating && (
                    <div className="flex items-center gap-1 text-secondary shrink-0">
                      <span
                        className="material-symbols-outlined text-sm block leading-none"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="text-[12px] leading-[1.0] tracking-[0.1em] font-semibold">
                        {recipe.rating}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </TabContent>
      <TabContent contentIndex={1}>
        <div className="mt-12 text-center text-on-surface-variant py-20">
          <p className="text-body-lg">No hay colecciones guardadas a&uacute;n.</p>
        </div>
      </TabContent>
    </Tabs>
  );
};

export default ProfilePageAccountTabs;
