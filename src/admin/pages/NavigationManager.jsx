import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Modal from '../../components/Modal.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { useToast } from '../../components/Toast.jsx';
import { useSiteData } from '../../lib/useStore.js';
import { store } from '../../lib/storage.js';
import { generateId } from '../../lib/security.js';

const BLANK = { title: '', url: '', visible: true };

export default function NavigationManager() {
  const data = useSiteData();
  const { show } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [pendingDelete, setPendingDelete] = useState(null);

  const items = useMemo(() => [...data.navigation].sort((a, b) => a.order - b.order), [data.navigation]);

  function openCreate() {
    setEditingId(null);
    setForm(BLANK);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setForm({ ...BLANK, ...item });
    setModalOpen(true);
  }

  function handleSave(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    if (editingId) {
      store.updateNavItem(editingId, form);
      show('Navigation item updated.', 'success');
    } else {
      store.addNavItem({ id: generateId('nav'), ...form });
      show('Navigation item added.', 'success');
    }
    setModalOpen(false);
  }

  function move(index, direction) {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    store.reorderNav(next);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Navigation</h1>
          <p className="text-sm text-muted mt-1">Controls the links shown in the site header.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add item
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon="Compass" title="No navigation items" actionLabel="Add item" onAction={openCreate} />
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={item.id}>
              <Card className={`p-4 flex items-center gap-4 ${!item.visible ? 'opacity-60' : ''}`}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                  <p className="text-xs text-muted truncate font-mono">{item.url}</p>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <button
                    type="button"
                    className="p-2 rounded-lg text-muted hover:bg-black/5 hover:text-ink disabled:opacity-30"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${item.title} up`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg text-muted hover:bg-black/5 hover:text-ink disabled:opacity-30"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Move ${item.title} down`}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={item.visible}
                  aria-label={item.visible ? 'Hide item' : 'Show item'}
                  onClick={() => store.updateNavItem(item.id, { visible: !item.visible })}
                  className="p-2 rounded-lg text-muted hover:bg-black/5 hover:text-ink"
                >
                  {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  aria-label={`Edit ${item.title}`}
                  className="p-2 rounded-lg text-muted hover:bg-black/5 hover:text-ink"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(item)}
                  aria-label={`Delete ${item.title}`}
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
        title={editingId ? 'Edit navigation item' : 'Add navigation item'}
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
            <label className="text-sm font-medium text-ink block mb-1.5">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">URL</label>
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="/, #modules, /about…"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              required
            />
          </div>
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => setForm({ ...form, visible: e.target.checked })}
              className="w-4 h-4 accent-[color:var(--accent)]"
            />
            <span className="text-sm text-ink">Visible</span>
          </label>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete navigation item?"
        message={`"${pendingDelete?.title}" will be removed from the header.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          store.deleteNavItem(pendingDelete.id);
          show('Navigation item deleted.', 'info');
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
