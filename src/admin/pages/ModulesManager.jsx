import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Modal from '../../components/Modal.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import SearchBox from '../../components/SearchBox.jsx';
import Icon, { ICON_CHOICES } from '../../components/Icon.jsx';
import { useToast } from '../../components/Toast.jsx';
import { useSiteData } from '../../lib/useStore.js';
import { store } from '../../lib/storage.js';
import { generateId, sanitizeUrl } from '../../lib/security.js';

const BLANK_MODULE = {
  title: '',
  description: '',
  buttonText: '',
  url: '',
  icon: 'LayoutGrid',
  bgColor: '#12355B',
  visible: true,
  imageUrl: '',
};

export default function ModulesManager() {
  const data = useSiteData();
  const { show } = useToast();
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK_MODULE);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [dragId, setDragId] = useState(null);

  const modules = useMemo(
    () => [...data.modules].sort((a, b) => a.order - b.order),
    [data.modules],
  );

  const filtered = modules.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()));

  function openCreate() {
    setEditingId(null);
    setForm(BLANK_MODULE);
    setModalOpen(true);
  }

  function openEdit(mod) {
    setEditingId(mod.id);
    setForm({ ...BLANK_MODULE, ...mod });
    setModalOpen(true);
  }

  function handleSave(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editingId) {
      store.updateModule(editingId, form);
      show('Module updated.', 'success');
    } else {
      store.addModule({ id: generateId('module'), ...form });
      show('Module added.', 'success');
    }
    setModalOpen(false);
  }

  function moveModule(index, direction) {
    const next = [...modules];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    store.reorderModules(next);
  }

  function handleDrop(targetId) {
    if (!dragId || dragId === targetId) return;
    const next = [...modules];
    const fromIndex = next.findIndex((m) => m.id === dragId);
    const toIndex = next.findIndex((m) => m.id === targetId);
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    store.reorderModules(next);
    setDragId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Modules</h1>
          <p className="text-sm text-muted mt-1">Rendered automatically in the home page's Modules section.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add module
        </Button>
      </div>

      <SearchBox value={query} onChange={setQuery} placeholder="Search modules…" className="max-w-sm" />

      {filtered.length === 0 ? (
        <EmptyState
          icon="LayoutGrid"
          title={query ? 'No modules match your search' : 'No modules yet'}
          message={!query ? 'Add your first module to see it appear on the home page.' : undefined}
          actionLabel={!query ? 'Add module' : undefined}
          onAction={!query ? openCreate : undefined}
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((mod, index) => (
            <li key={mod.id}>
              <Card
                draggable
                onDragStart={() => setDragId(mod.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(mod.id)}
                className={`p-4 flex items-center gap-4 ${!mod.visible ? 'opacity-60' : ''}`}
              >
                <span className="cursor-grab text-muted" title="Drag to reorder">
                  <GripVertical className="w-4 h-4" aria-hidden="true" />
                </span>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: mod.bgColor }}
                >
                  <Icon name={mod.icon} className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink truncate">{mod.title}</p>
                  <p className="text-xs text-muted truncate">{mod.description}</p>
                </div>

                <div className="hidden sm:flex items-center gap-1">
                  <button
                    type="button"
                    className="p-2 rounded-lg text-muted hover:bg-black/5 hover:text-ink disabled:opacity-30"
                    onClick={() => moveModule(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${mod.title} up`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg text-muted hover:bg-black/5 hover:text-ink disabled:opacity-30"
                    onClick={() => moveModule(index, 1)}
                    disabled={index === filtered.length - 1}
                    aria-label={`Move ${mod.title} down`}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={mod.visible}
                  aria-label={mod.visible ? 'Hide module' : 'Show module'}
                  onClick={() => store.toggleModuleVisibility(mod.id)}
                  className="p-2 rounded-lg text-muted hover:bg-black/5 hover:text-ink"
                >
                  {mod.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(mod)}
                  aria-label={`Edit ${mod.title}`}
                  className="p-2 rounded-lg text-muted hover:bg-black/5 hover:text-ink"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(mod)}
                  aria-label={`Delete ${mod.title}`}
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
        title={editingId ? 'Edit module' : 'Add module'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save module
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-ink block mb-1.5">Module name</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-ink block mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Button text</label>
            <input
              value={form.buttonText}
              onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Destination URL</label>
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https:// or /page or #section"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Icon</label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            >
              {ICON_CHOICES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Background color</label>
            <input
              type="color"
              value={form.bgColor}
              onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
              className="w-full h-11 rounded-xl border border-line cursor-pointer"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-ink block mb-1.5">Image URL (optional)</label>
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="Overrides the icon tile if set"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>
          <label className="flex items-center gap-2.5 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => setForm({ ...form, visible: e.target.checked })}
              className="w-4 h-4 accent-[color:var(--accent)]"
            />
            <span className="text-sm text-ink">Visible on home page</span>
          </label>

          {/* Live preview */}
          <div className="sm:col-span-2 pt-2 border-t border-line">
            <p className="text-xs font-medium uppercase tracking-wide text-muted mb-3">Live preview</p>
            <Card className="p-6 max-w-sm">
              {form.imageUrl ? (
                <img src={sanitizeUrl(form.imageUrl)} alt="" className="w-full h-28 object-cover rounded-xl mb-4" />
              ) : (
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white"
                  style={{ backgroundColor: form.bgColor }}
                >
                  <Icon name={form.icon} className="w-5 h-5" />
                </div>
              )}
              <h3 className="text-base font-semibold text-ink mb-1.5">{form.title || 'Module title'}</h3>
              <p className="text-sm text-muted">{form.description || 'Module description goes here.'}</p>
              {form.buttonText && (
                <Button variant="secondary" size="sm" className="mt-4" as="a" href="#">
                  {form.buttonText}
                </Button>
              )}
            </Card>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete module?"
        message={`"${pendingDelete?.title}" will be removed from the home page immediately.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          store.deleteModule(pendingDelete.id);
          show('Module deleted.', 'info');
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
