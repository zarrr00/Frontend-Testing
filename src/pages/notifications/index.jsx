import { useNotifications } from '../../hooks/useNotifications';
import { useMode } from '../../contexts/ModeContext';
import { formatDate } from '../../utils/date';
import AnimatedContent from '../../components/ui/AnimatedContent';
import { Bell, CheckCheck, Info, AlertTriangle, Megaphone } from 'lucide-react';

const ICON_MAP = {
  info: Info,
  warning: AlertTriangle,
  announcement: Megaphone,
};

export default function Notifications() {
  const { mode } = useMode();
  const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead } = useNotifications();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4 md:space-y-6">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <Bell className={`w-6 h-6 md:w-8 md:h-8 text-${accentColor}-600`} />
            <h1 className="text-xl md:text-2xl font-bold">Notifikasi</h1>
            {unreadCount > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold bg-${accentColor}-600 text-white`}>
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <CheckCheck className="w-4 h-4" /> Tandai semua dibaca
            </button>
          )}
        </div>
      </AnimatedContent>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground text-sm">Memuat notifikasi...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 text-sm">Gagal memuat notifikasi</div>
      ) : notifications.length === 0 ? (
        <AnimatedContent direction="vertical" delay={100}>
          <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-2xl shadow-sm">
            <Bell className="w-14 h-14 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-lg">Tidak ada notifikasi</p>
            <p className="text-sm mt-1">Kamu akan melihat pemberitahuan di sini</p>
          </div>
        </AnimatedContent>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => {
            const IconComp = ICON_MAP[notif.type] || Info;
            const isUnread = !notif.read_at;

            return (
              <AnimatedContent key={notif.id} direction="vertical" delay={100 + i * 50}>
                <div
                  onClick={() => isUnread && markAsRead(notif.id)}
                  className={`bg-card border rounded-2xl p-4 shadow-sm transition-all cursor-pointer hover:shadow-md ${isUnread ? `border-${accentColor}-300 dark:border-${accentColor}-700 bg-${accentColor}-50/50 dark:bg-${accentColor}-900/10` : 'border-border'}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isUnread ? `bg-${accentColor}-100 dark:bg-${accentColor}-900/30` : 'bg-muted'}`}>
                      <IconComp className={`w-4 h-4 ${isUnread ? `text-${accentColor}-600` : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${isUnread ? 'font-semibold' : 'font-medium text-muted-foreground'}`}>
                        {notif.title || 'Notifikasi'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message || notif.body}</p>
                      {notif.created_at && (
                        <p className="text-[10px] text-muted-foreground mt-1.5">{formatDate(notif.created_at)}</p>
                      )}
                    </div>
                    {isUnread && (
                      <div className={`w-2 h-2 rounded-full bg-${accentColor}-500 shrink-0 mt-2`} />
                    )}
                  </div>
                </div>
              </AnimatedContent>
            );
          })}
        </div>
      )}
    </div>
  );
}
