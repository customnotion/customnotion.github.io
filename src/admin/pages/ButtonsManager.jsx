import { useState } from 'react';
import { Plus, Pencil, Trash2, Power } from 'lucide-react';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Modal from '../../components/Modal.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { useToast } from '../../components/Toast.jsx';
import { useSiteData } from '../../lib/useStore.js';
import { store } from '../../lib/storage.js';
import { generateId } from '../../lib/security.js';

const BLANK = { text: '', destination: '', style: 'primary', color: '#12355B', newTab: false, enabled: true };
const STYLES = ['primary', 'secondary', 'ghost'];

export default function ButtonsManager() {
  const data = useSiteData();
  const { show } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [pendingDelete, setPendingDelete] = useState(null);

  function openCreate() {
    setEditingId(null);
    setForm(BLANK);
    setModalOpen(true);
  }

  function openEdit(btn) {
    setEditingId(btn.id);
    setForm({ ...BLANK, ...btn });
    setModalOpen(true);
  }

  function handleSave(e) {
    e.preventDefault();
    if (!form.text.trim() || !form.destination.trim()) return;
    if (editingId) {
      store.updateButton(editingId, form);
      show('Button updated.', 'success');
    } else {
      store.addButton({ id: generateId('button'), ...form });
      show('Button added.', 'success');
    }
    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Buttons</h1>
          <p className="text-sm text-muted mt-1">Reusable call-to-action buttons, e.g. for the hero section.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add button
        </Button>
      </div>

      {data.buttons.length === 0 ? (
        <EmptyState icon="MousePointerClick" title="No buttons yet" actionLabel="Add button" onAction={openCreate} />
      ) : (
        <ul className="space-y-3">
          {data.buttons.map((btn) => (
            <li key={btn.id}>
              <Card className={`p-4 flex items-center gap-4 ${!btn.enabled ? 'opacity-60' : ''}`}>
                <Button variant={btn.style} size="sm" style={{ backgroundColor: btn.style === 'primary' ? btn.color : undefined, borderColor: btn.style === 'secondary' ? btn.color : undefined, color: btn.style === 'secondary' ? btn.color : undefined }}>
                  {btn.text}
                </Button>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted truncate font-mono">{btn.destination}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={btn.enabled}
                  aria-label={btn.enabled ? 'Disable button' : 'Enable button'}
                  onClick={() => store.updateButton(btn.id, { enabled: !btn.enabled })}
                  className="p-2 rounded-lg text-muted hover:bg-black/5 hover:text-ink"
                >
                  <Power className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(btn)}
                  aria-label={`Edit ${btn.text}`}
                  className="p-2 rounded-lg text-muted hover:bg-black/5 hover:text-ink"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(btn)}
                  aria-label={`Delete ${btn.text}`}
                  className="p-2 rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit button' : 'Add button'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Text</label>
            <input
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Destination</label>
            <input
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              placeholder="https:// or /page or #section"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-ink block mb-1.5">Style</label>
              <select
                value={form.style}
                onChange={(e) => setForm({ ...form, style: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              >
                {STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-ink block mb-1.5">Color</label>
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full h-[42px] rounded-xl border border-line cursor-pointer"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={form.newTab}
                onChange={(e) => setForm({ ...form, newTab: e.target.checked })}
                className="w-4 h-4 accent-[color:var(--accent)]"
              />
              <span className="text-sm text-ink">Open in new tab</span>
            </label>
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="w-4 h-4 accent-[color:var(--accent)]"
              />
              <span className="text-sm text-ink">Enabled</span>
            </label>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete button?"
        message={`"${pendingDelete?.text}" will be removed.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          store.deleteButton(pendingDelete.id);
          show('Button deleted.', 'info');
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
