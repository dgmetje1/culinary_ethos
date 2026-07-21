import ProfilePageAccountDetails from "./AccountDetails";
import ProfilePageAccountTabs from "./AccountTabs";

const ProfilePage = () => {
  return (
    <main className="pb-20 max-w-[1200px] mx-auto px-8">
      <div className="pt-32">
        <ProfilePageAccountDetails />
        <ProfilePageAccountTabs />
      </div>
    </main>
  );
};

export default ProfilePage;
