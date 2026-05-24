import bannerImg from "@/assets/banner-profile.jpg";

import ProfilePageAccountDetails from "./AccountDetails";
import ProfilePageAccountTabs from "./AccountTabs";

const ProfilePage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <img
        alt="profile banner with some cooks in a kitchen"
        height="100%"
        src={bannerImg}
        width="100%"
        style={{ maxHeight: "30vh", objectFit: "cover" }}
      />
      <div className="container max-w-5xl mx-auto px-6">
        <ProfilePageAccountDetails />
        <ProfilePageAccountTabs />
      </div>
    </div>
  );
};

export default ProfilePage;
