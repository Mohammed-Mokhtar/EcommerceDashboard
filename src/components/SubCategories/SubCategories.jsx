import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

const subCategorySchema = z.object({
  name: z
    .string()
    .min(3, "name minimum length is 3 characters")
    .max(30, "name maximum length is 30 characters"),
  category: z.string().min(1, "Category is required"),
});
const subCategorySchemaEdit = z.object({
  name: z
    .string()
    .min(3, "name minimum length is 3 characters")
    .max(30, "name maximum length is 30 characters"),
});

export default function SubCategories() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subCategoryDeleteId, setSubCategoryDeleteId] = useState(null);
  const [subCategoryEditId, setSubCategoryEditId] = useState(null);

  const {
    register: addRegister,
    handleSubmit: handleAddSubmit,
    reset: resetAddForm,
    formState: { errors: addErrors },
  } = useForm({
    defaultValues: { name: "", category: "" },
    resolver: zodResolver(subCategorySchema),
  });

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm({
    defaultValues: { name: "" },
    resolver: zodResolver(subCategorySchemaEdit),
  });

  const getCategoryNameById = (id) => {
    const category = categories.find((cat) => cat._id === id);
    return category?.name;
  };

  const getAllSubCategories = () => {
    axios
      .get("https://nti-ecommerce.vercel.app/api/v1/subCategories")
      .then((res) => {
        setSubCategories(res.data.categories);
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
      });
  };

  const getAllCategories = () => {
    axios
      .get("https://nti-ecommerce.vercel.app/api/v1/categories")
      .then((res) => {
        setCategories(res.data.categories);
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
      });
  };

  const handleAddSubCategory = (data) => {
    axios
      .post("https://nti-ecommerce.vercel.app/api/v1/subCategories", data)
      .then(() => {
        resetAddForm();
        setIsAddModalOpen(false);
        getAllSubCategories();
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
      });
  };

  const openEditModal = (subCategory) => {
    const subCategoryId = subCategory?._id || subCategory?.id;
    setSubCategoryEditId(subCategoryId);
    setEditValue("name", subCategory?.name || "");
    setEditValue("category", subCategory?.category || "");
    setIsEditModalOpen(true);
  };

  const handleEditSubCategory = (data) => {
    if (!subCategoryEditId) return;
    axios
      .put(
        `https://nti-ecommerce.vercel.app/api/v1/subCategories/${subCategoryEditId}`,
        data,
      )
      .then(() => {
        resetEditForm();
        setSubCategoryEditId(null);
        setIsEditModalOpen(false);
        getAllSubCategories();
        toast.success("Subcategory updated successfully");
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
      });
  };

  const handleDelete = () => {
    if (!subCategoryDeleteId) return;

    axios
      .delete(
        `https://nti-ecommerce.vercel.app/api/v1/subCategories/${subCategoryDeleteId}`,
      )
      .then(() => {
        setSubCategoryDeleteId(null);
        setIsDeleteModalOpen(false);
        getAllSubCategories();
        toast.success("Subcategory deleted successfully");
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
      });
  };

  useEffect(() => {
    getAllSubCategories();
    getAllCategories();
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none ms-auto me-5 block mb-5 cursor-pointer"
        type="button"
      >
        Add Subcategory
      </button>

      <div
        className={`${isAddModalOpen ? "flex" : "hidden"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
              <h3 className="text-lg font-medium text-heading">
                Create subcategory
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 inline-flex justify-center items-center"
              >
                <span className="sr-only">Close modal</span>✕
              </button>
            </div>
            <form onSubmit={handleAddSubmit(handleAddSubCategory)}>
              <div className="grid gap-4 grid-cols-2 py-4 md:py-6">
                <div className="col-span-2">
                  <label
                    htmlFor="sub-name"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Subcategory name
                  </label>
                  <input
                    id="sub-name"
                    type="text"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="Type subcategory name"
                    {...addRegister("name")}
                  />
                  {addErrors.name && (
                    <p className="mt-1 text-sm text-danger">
                      {addErrors.name.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="sub-category"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Parent category
                  </label>
                  <select
                    id="sub-category"
                    className="block w-full bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs"
                    {...addRegister("category")}
                  >
                    <option value="">Select category</option>
                    {categories?.map((category) => (
                      <option
                        key={category?._id || category?.id}
                        value={category?._id || category?.id}
                      >
                        {category?.name}
                      </option>
                    ))}
                  </select>
                  {addErrors.category && (
                    <p className="mt-1 text-sm text-danger">
                      {addErrors.category.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">
                <button
                  type="submit"
                  className="inline-flex items-center text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                >
                  Add new subcategory
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        <div
          className="absolute top-0 left-0 bg-gray-900/80 w-full h-full -p10 -z-10"
          onClick={() => setIsAddModalOpen(false)}
        ></div>
      </div>

      <div
        className={`${isEditModalOpen ? "flex" : "hidden"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
              <h3 className="text-lg font-medium text-heading">
                Edit subcategory
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 inline-flex justify-center items-center"
              >
                <span className="sr-only">Close modal</span>✕
              </button>
            </div>
            <form onSubmit={handleEditSubmit(handleEditSubCategory)}>
              <div className="grid gap-4 grid-cols-2 py-4 md:py-6">
                <div className="col-span-2">
                  <label
                    htmlFor="edit-sub-name"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Subcategory name
                  </label>
                  <input
                    id="edit-sub-name"
                    type="text"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    {...editRegister("name")}
                  />
                  {editErrors.name && (
                    <p className="mt-1 text-sm text-danger">
                      {editErrors.name.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">
                <button
                  type="submit"
                  className="inline-flex items-center text-white bg-warning hover:bg-warning-strong box-border border border-transparent focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className={`${isDeleteModalOpen ? "flex" : "hidden"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full`}
      >
        <div className="relative p-4 w-full max-w-md h-full md:h-auto">
          <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <p className="mb-4 text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this subcategory?
            </p>
            <div className="flex justify-center items-center space-x-4">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
              >
                No, cancel
              </button>
              <button
                onClick={handleDelete}
                type="button"
                className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Yes, I'm sure
              </button>
            </div>
          </div>
        </div>
        <div
          className="absolute top-0 left-0 bg-gray-900/80 w-full h-full -p10 -z-10"
          onClick={() => setIsDeleteModalOpen(false)}
        ></div>
      </div>

      <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-default-medium">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">
                Subcategory name
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Parent category
              </th>

              <th scope="col" className="px-6 py-3 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {subCategories?.map((subCategory) => {
              const rowId = subCategory?._id || subCategory?.id;
              const categoryId = subCategory?.category;
              return (
                <tr
                  key={rowId}
                  className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium"
                >
                  <td className="px-6 py-4 text-heading whitespace-nowrap">
                    {subCategory.name}
                  </td>
                  <td className="px-6 py-4">
                    {getCategoryNameById(categoryId)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => openEditModal(subCategory)}
                      className="text-white bg-warning box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none cursor-pointer me-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubCategoryDeleteId(rowId);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
