import { useMembers } from '../../../hooks/useMembers';
import { useMode } from '../../../contexts/ModeContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { Users, UserPlus, Mail, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function MobileMembers() {
  const { mode } = useMode();
  const { confirmDialog } = useConfirm();
  const { members, loading, error, invite, removeMember } = useMembers();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [inviting, setInviting] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setInviting(true);
    try {
      await invite(null, email.trim(), role);
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
    <div className="p-4 space-y-4">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center gap-2">
          <Users className={`w-6 h-6 text-${accentColor}-600`} />
          <h1 className="text-xl font-bold">Anggota Tim</h1>
        </div>
      </AnimatedContent>

      <AnimatedContent direction="vertical" delay={100}>
        <form onSubmit={handleInvite} className="flex gap-2">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-24 px-2 py-2.5 rounded-xl border border-border bg-card text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <button type="submit" disabled={inviting} className={`p-2.5 rounded-xl text-white bg-${accentColor}-600 shadow-lg disabled:opacity-50`}>
            <UserPlus className="w-5 h-5" />
          </button>
        </form>
      </AnimatedContent>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground text-sm">Memuat...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 text-sm">Gagal memuat</div>
      ) : members.length === 0 ? (
        <AnimatedContent direction="vertical" delay={200}>
          <div className="p-8 text-center text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Belum ada anggota</p>
          </div>
        </AnimatedContent>
      ) : (
        <div className="space-y-3">
          {members.map((member, i) => (
            <AnimatedContent key={member.id} direction="vertical" delay={200 + i * 60}>
              <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-${accentColor}-100 dark:bg-${accentColor}-900/30 text-${accentColor}-600 font-bold text-sm`}>
                  {(member.name || member.email || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm truncate">{member.name || member.email}</p>
                    <p className="text-[11px] text-muted-foreground capitalize">{member.role || 'member'}</p>
                  </div>
                  <button onClick={() => handleDelete(member.id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>
      )}
    </div>
  );
}
