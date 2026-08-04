import { Bike as BikeIcon, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Topbar from "../../components/layout/Topbar";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";
import { useBikes, useDeleteBike } from "../../hooks/useBikes";
import BikeForm from "./BikeForm";

export default function BikesList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingBike, setEditingBike] = useState(null);
  const [deletingBike, setDeletingBike] = useState(null);

  const bikes = useBikes({ page, limit: 10, search: search || undefined, isActive: "true" });
  const deleteBike = useDeleteBike();

  const openCreate = () => {
    setEditingBike(null);
    setFormOpen(true);
  };
  const openEdit = (bike) => {
    setEditingBike(bike);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditingBike(null);
  };

  const handleDelete = async () => {
    try {
      await deleteBike.mutateAsync(deletingBike._id);
      toast.success("Bike removed");
      setDeletingBike(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Topbar
        title="Bikes"
        actions={
          <Button onClick={openCreate}>
            <Plus size={14} /> Add bike
          </Button>
        }
      />

      <div className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search bikes…"
              className="focus-ring w-full rounded-lg border border-ink-600 bg-ink-800 py-2 pl-8 pr-3 text-sm text-ink-100 placeholder:text-ink-500"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
          {bikes.isLoading ? (
            <Spinner />
          ) : bikes.data?.data?.length ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-800 text-xs text-ink-400">
                      <th className="px-5 py-3 font-medium">Bike</th>
                      <th className="px-5 py-3 font-medium">Brand</th>
                      <th className="px-5 py-3 font-medium">Category</th>
                      <th className="px-5 py-3 font-medium">Price</th>
                      <th className="px-5 py-3 font-medium">Stock</th>
                      <th className="px-5 py-3 font-medium">Flags</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-800">
                    {bikes.data.data.map((bike) => (
                      <tr key={bike._id} className="hover:bg-ink-800/40">
                        <td className="flex items-center gap-3 px-5 py-3">
                          <img
                            src={bike.thumbnail}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                          />
                          <span className="font-medium text-ink-100">{bike.name}</span>
                        </td>
                        <td className="px-5 py-3 text-ink-300">{bike.brand}</td>
                        <td className="px-5 py-3 text-ink-300">
                          {bike.category?.name || "—"}
                        </td>
                        <td className="px-5 py-3 text-ink-300">
                          ৳{bike.price?.toLocaleString()}
                          {bike.offerPrice ? (
                            <span className="ml-1.5 text-xs text-ember-400">
                              → ৳{bike.offerPrice.toLocaleString()}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-5 py-3 text-ink-300">{bike.stock}</td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1">
                            {bike.isFeatured && (
                              <Badge className="border-ember-500/30 bg-ember-500/10 text-ember-300">
                                Featured
                              </Badge>
                            )}
                            {bike.isSale && (
                              <Badge className="border-rose-500/30 bg-rose-500/10 text-rose-300">
                                Sale
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => openEdit(bike)}
                              className="focus-ring rounded-md p-1.5 text-ink-400 hover:bg-ink-800 hover:text-ink-100"
                              aria-label="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeletingBike(bike)}
                              className="focus-ring rounded-md p-1.5 text-ink-400 hover:bg-rose-500/10 hover:text-rose-300"
                              aria-label="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={bikes.data.pagination.page}
                totalPages={bikes.data.pagination.totalPages}
                total={bikes.data.pagination.total}
                onPageChange={setPage}
              />
            </>
          ) : (
            <EmptyState
              icon={BikeIcon}
              title="No bikes yet"
              description="Add your first bike to see it here."
              action={
                <Button onClick={openCreate} size="sm">
                  <Plus size={14} /> Add bike
                </Button>
              }
            />
          )}
        </div>
      </div>

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editingBike ? "Edit bike" : "Add bike"}
        width="max-w-3xl"
      >
        <BikeForm bike={editingBike} onDone={closeForm} />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingBike)}
        onClose={() => setDeletingBike(null)}
        onConfirm={handleDelete}
        loading={deleteBike.isPending}
        title="Remove this bike?"
        description={`"${deletingBike?.name}" will be hidden from the storefront. This is a soft delete — it can be restored later.`}
        confirmLabel="Remove"
      />
    </>
  );
}
