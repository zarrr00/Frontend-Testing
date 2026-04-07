import { useMembers } from '../../../hooks/useMembers';
import { useMode } from '../../../contexts/ModeContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { Users, UserPlus, Trash2, Mail, Shield } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DesktopMembers() {
  const { mode } = useMode();
  const { confirmDialog } = useConfirm();
  const { members, loading, error, invite, removeMember } = useMembers();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';
  const [email, setEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setInviting(true);
    try {
      await invite(null, email.trim());
      setEmail('');
      toast.success('Undangan terkirim!');
    } catch (err) {
      toast.error('Gagal mengirim undangan');
    } finally {
      setInviting(false);
    }
  };

  const handleDelete = async (id) => {
    confirmDialog({
      title: 'Hapus Anggota',
      description: 'Yakin ingin menghapus anggota ini?',
      onConfirm: async () => {
        try {
          await removeMember(id);
          toast.success('Anggota dihapus');
        } catch (err) {
          toast.error('Gagal menghapus anggota');
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center gap-3">
          <Users className={`w-8 h-8 text-${accentColor}-600`} />
          <h1 className="text-2xl font-bold">Anggota Tim</h1>
        </div>
      </AnimatedContent>

      {/* Invite Form */}
      <AnimatedContent direction="vertical" delay={100}>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Undang Anggota Baru
          </h2>
          <form onSubmit={handleInvite} className="flex gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Masukkan email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
            <button
              type="submit"
              disabled={inviting}
              className={`px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-${accentColor}-600 hover:bg-${accentColor}-700 transition-colors shadow-lg disabled:opacity-50`}
            >
              {inviting ? 'Mengirim...' : 'Undang'}
            </button>
          </form>
        </div>
      </AnimatedContent>

      {/* Member List */}
      <AnimatedContent direction="vertical" delay={200}>
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4" /> Anggota Aktif
            </h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Memuat...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">Gagal memuat data</div>
          ) : members.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Users className="w-14 h-14 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Belum ada anggota tim</p>
              <p className="text-sm mt-1">Undang rekan kerjamu untuk kolaborasi</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${accentColor}-100 dark:bg-${accentColor}-900/30 text-${accentColor}-600 font-bold text-sm`}>
                      {(member.name || member.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{member.name || member.email}</p>
                      {member.name && <p className="text-xs text-muted-foreground">{member.email}</p>}
                      <p className="text-[10px] text-muted-foreground capitalize">{member.role || 'member'}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(member.id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </AnimatedContent>
    </div>
  );
}
