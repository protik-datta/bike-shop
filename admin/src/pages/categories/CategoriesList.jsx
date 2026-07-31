import { Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Topbar from "../../components/layout/Topbar";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import { useCategories, useDeleteCategory } from "../../hooks/useCategories";
import CategoryForm from "./CategoryForm";

export default function CategoriesList() {
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const categories = useCategories({ page, limit: 12, isActive: "true" });
  const deleteCategory = useDeleteCategory();

  const openCreate = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };
  const openEdit = (category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = async () => {
    setDeleteError("");
    try {
      await deleteCategory.mutateAsync(deletingCategory.id);
      toast.success("Category removed");
      setDeletingCategory(null);
    } catch (err) {
      // e.g. 409 when bikes are still linked to this category
      setDeleteError(err.message);
    }
  };

  return (
    <>
      <Topbar
        title="Categories"
        actions={
          <Button onClick={openCreate}>
            <Plus size={14} /> Add category
          </Button>
        }
      />

      <div className="p-6">
        {categories.isLoading ? (
          <Spinner />
        ) : categories.data?.data?.length ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.data.data.map((category) => (
                <div
                  key={category.id}
                  className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900"
                >
                  <img
                    src={category.image}
                    alt=""
                    className="h-32 w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-sm font-semibold text-ink-100">
                        {category.name}
                      </h3>
                      <div className="flex shrink-0 gap-1">
                        <button
                          onClick={() => openEdit(category)}
                          className="focus-ring rounded-md p-1.5 text-ink-400 hover:bg-ink-800 hover:text-ink-100"
                          aria-label="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(category)}
                          className="focus-ring rounded-md p-1.5 text-ink-400 hover:bg-rose-500/10 hover:text-rose-300"
                          aria-label="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-ink-400">
                      {category.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-ink-700 bg-ink-900">
              <Pagination
                page={categories.data.pagination.page}
                totalPages={categories.data.pagination.totalPages}
                total={categories.data.pagination.total}
                onPageChange={setPage}
              />
            </div>
          </>
        ) : (
          <EmptyState
            icon={Tags}
            title="No categories yet"
            description="Create a category before adding bikes to it."
            action={
              <Button onClick={openCreate} size="sm">
                <Plus size={14} /> Add category
              </Button>
            }
          />
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editingCategory ? "Edit category" : "Add category"}
      >
        <CategoryForm category={editingCategory} onDone={closeForm} />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingCategory)}
        onClose={() => {
          setDeletingCategory(null);
          setDeleteError("");
        }}
        onConfirm={handleDelete}
        loading={deleteCategory.isPending}
        title="Remove this category?"
        description={
          deleteError ||
          `"${deletingCategory?.name}" will be hidden from the storefront. Deletion is blocked if any bikes still reference it.`
        }
        confirmLabel="Remove"
      />
    </>
  );
}
