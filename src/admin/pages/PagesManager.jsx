import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Modal from '../../components/Modal.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Icon, { ICON_CHOICES } from '../../components/Icon.jsx';
import { useToast } from '../../components/Toast.jsx';
import { useSiteData } from '../../lib/useStore.js';
import { store } from '../../lib/storage.js';
import { generateId, slugify } from '../../lib/security.js';

const BLANK = { name: '', slug: '', description: '', content: '', showOnHome: false, icon: 'FileText' };
const RESERVED_SLUGS = new Set(['admin']);

export default function PagesManager() {
  const data = useSiteData();
  const { show } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [slugTouched, setSlugTouched] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const pages = useMemo(() => [...data.pages].sort((a, b) => a.order - b.order), [data.pages]);

  function move(index, direction) {
    const next = [...pages];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    store.reorderPages(next);
  }

  function openCreate() {
    setEditingId(null);
    setForm(BLANK);
    setSlugTouched(false);
    setModalOpen(true);
  }

  function openEdit(page) {
    setEditingId(page.id);
    setForm({ ...BLANK, ...page });
    setSlugTouched(true);
    setModalOpen(true);
  }

  function handleNameChange(name) {
    setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
  }

  function handleSave(e) {
    e.preventDefault();
    const slug = slugify(form.slug || form.name);
    if (!form.name.trim() || !slug) return;
    if (RESERVED_SLUGS.has(slug)) {
      show('That slug is reserved. Please choose another.', 'error');
      return;
    }
    const clash = data.pages.find((p) => p.slug === slug && p.id !== editingId);
    if (clash) {
      show('Another page already uses that slug.', 'error');
      return;
    }
    const payload = { ...form, slug };
    if (editingId) {
      store.updatePage(editingId, payload);
      show('Page updated.', 'success');
    } else {
      store.addPage({ id: generateId('page'), ...payload });
      show('Page created.', 'success');
    }
    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Pages</h1>
          <p className="text-sm text-muted mt-1">
            Each page is available at <code className="text-xs bg-black/5 px-1.5 py-0.5 rounded">#/&lt;slug&gt;</code>.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add page
        </Button>
      </div>

      {pages.length === 0 ? (
        <EmptyState icon="FileText" title="No pages yet" actionLabel="Add page" onAction={openCreate} />
      ) : (
        <ul className="space-y-3">
          {pages.map((page, index) => (
            <li key={page.id}>
              <Card className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <Icon name={page.icon} className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink truncate">{page.name}</p>
                  <p className="text-xs text-muted truncate font-mono">/{page.slug}</p>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <button
                    type="button"
                    className="p-2 rounded-lg text-muted hover:bg-black/5 hover:text-ink disabled:opacity-30"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${page.name} up`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg text-muted hover:bg-black/5 hover:text-ink disabled:opacity-30"
                    onClick={() => move(index, 1)}
                    disabled={index === pages.length - 1}
                    aria-label={`Move ${page.name} down`}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                {page.showOnHome && (
                  <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                    On home
                  </span>
                )}
                <a
                  href={`#/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted hover:bg-black/5 hover:text-ink"
                  aria-label={`Open ${page.name}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => openEdit(page)}
                  aria-label={`Edit ${page.name}`}
                  className="p-2 rounded-lg text-muted hover:bg-black/5 hover:text-ink"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(page)}
                  aria-label={`Delete ${page.name}`}
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
        title={editingId ? 'Edit page' : 'Add page'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save page
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Page name</label>
            <input
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm({ ...form, slug: e.target.value });
              }}
              placeholder="auto-generated from name"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-ink block mb-1.5">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-ink block mb-1.5">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={5}
              placeholder="Separate paragraphs with a blank line."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none"
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
          <label className="flex items-center gap-2.5 self-end pb-2.5">
            <input
              type="checkbox"
              checked={form.showOnHome}
              onChange={(e) => setForm({ ...form, showOnHome: e.target.checked })}
              className="w-4 h-4 accent-[color:var(--accent)]"
            />
            <span className="text-sm text-ink">Show on home page</span>
          </label>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete page?"
        message={`"${pendingDelete?.name}" and its content will be removed.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          store.deletePage(pendingDelete.id);
          show('Page deleted.', 'info');
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
