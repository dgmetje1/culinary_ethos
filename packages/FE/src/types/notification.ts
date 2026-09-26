export type NotificationItem = {
  id: string;
  type: "follow" | "new_recipe";
  actorId?: string;
  actorName?: string;
  recipeId?: string;
  recipeTitle?: string;
  read: boolean;
  createdAt: string;
};

export type UnreadCount = {
  count: number;
};
