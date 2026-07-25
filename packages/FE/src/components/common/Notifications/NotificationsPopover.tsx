import React, { useState, useCallback } from 'react';
import { Bell, Check, User, FileText } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import { useGetNotifications, useGetUnreadCount } from '@/queries/notifications/queryHooks';
import { useMarkNotificationRead, useMarkAllNotificationsRead } from '@/queries/notifications/mutations';
import { cn } from '@/lib/utils';

const NotificationsPopover = () => {
  const [open, setOpen] = useState(false);
  const { data: notifications = [] } = useGetNotifications();
  const { data: unreadCount } = useGetUnreadCount();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleMarkRead = useCallback((id: string) => {
    markRead(id);
  }, [markRead]);

  const handleMarkAllRead = useCallback(() => {
    markAllRead();
  }, [markAllRead]);

  const unread = unreadCount?.count ?? 0;

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-stone-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-stone-900 dark:text-stone-100" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4.5 h-4.5 text-[10px] font-bold text-white bg-red-500 rounded-full min-w-[18px] min-h-[18px] px-1">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleClose} />
          <div className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 bg-white dark:bg-stone-950 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Notifications
              </h3>
              {unread > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllRead}
                  className="text-xs text-stone-500 hover:text-stone-900 h-auto py-1 px-2"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-stone-400">
                  <Bell className="w-8 h-8 mb-3 text-stone-300" />
                  <p className="text-sm font-medium">No notifications yet</p>
                  <p className="text-xs mt-1">When someone follows you or posts a recipe, you'll see it here.</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 transition-colors border-b border-stone-50 dark:border-stone-800/50 last:border-b-0',
                      notification.read ? 'bg-white dark:bg-stone-950' : 'bg-stone-50 dark:bg-stone-900',
                    )}
                    onClick={() => !notification.read && handleMarkRead(notification.id)}
                  >
                    <div className="mt-0.5 shrink-0">
                      {notification.type === 'follow' ? (
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-stone-800 dark:text-stone-200 leading-snug">
                        {notification.type === 'follow' ? (
                          <>
                              <Link
                              to="/author/$userId"
                              params={{ userId: notification.actorId || '' }}
                              onClick={handleClose}
                              className="font-semibold hover:text-stone-900 dark:hover:text-white"
                            >
                              {notification.actorName}
                            </Link>
                            {' started following you'}
                          </>
                        ) : (
                          <>
                            <span className="font-semibold">{notification.actorName}</span>
                            {' published a new recipe '}
                            {notification.recipeId ? (
                              <Link
                                to="/recipe/$id"
                                params={{ id: notification.recipeId }}
                                onClick={handleClose}
                                className="font-medium text-orange-700 dark:text-orange-400 hover:underline"
                              >
                                {notification.recipeTitle}
                              </Link>
                            ) : (
                              <span className="font-medium">{notification.recipeTitle}</span>
                            )}
                          </>
                        )}
                      </p>
                      <p className="text-xs text-stone-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPopover;
