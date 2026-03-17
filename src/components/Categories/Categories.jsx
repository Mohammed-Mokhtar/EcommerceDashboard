import React, { useEffect, useState } from "react";
import axios from "axios";
import { initFlowbite } from "flowbite";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryDeleteId, setCategoryDeleteId] = useState(null);
  const [categoryEditId, setCategoryEditId] = useState(null);

  const schema = z.object({
    name: z
      .string()
      .min(3, "name minimum length is 3 characters")
      .max(30, "name maximum length is 30 characters"),
    image: z.any().optional(),
  });

  const {
    register: addRegister,
    handleSubmit: handleAddSubmit,
    reset: resetAddForm,
    formState: { errors: addErrors },
  } = useForm({
    defaultValues: {
      name: "",
      image: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    setValue: setEditValue,
    reset: resetEditForm,
    formState: { errors: editErrors },
  } = useForm({
    defaultValues: {
      name: "",
      image: "",
    },
    resolver: zodResolver(schema),
  });

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

  const handleAddCategory = (data) => {
    let formData = new FormData();
    formData.append("name", data.name);
    console.log(data.image);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    axios
      .post("https://nti-ecommerce.vercel.app/api/v1/categories", formData)
      .then(() => {
        getAllCategories();
        toast.success("Category added successfully");
        resetAddForm();
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
      });
  };

  const handleDelete = () => {
    axios
      .delete(
        `https://nti-ecommerce.vercel.app/api/v1/categories/${categoryDeleteId}`,
      )
      .then(() => {
        setIsDeleteModalOpen(false);
        getAllCategories();
        setCategoryDeleteId(null);
        toast.success("Category deleted successfully");
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
      });
  };

  const openEditModal = (category) => {
    setCategoryEditId(category._id);
    setEditValue("name", category.name);
    setIsEditModalOpen(true);
  };

  const handleEditCategory = (data) => {
    if (!categoryEditId) return;

    let formData = new FormData();
    formData.append("name", data.name);
    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    axios
      .put(
        `https://nti-ecommerce.vercel.app/api/v1/categories/${categoryEditId}`,
        formData,
      )
      .then(() => {
        setIsEditModalOpen(false);
        setCategoryEditId(null);
        resetEditForm();
        getAllCategories();
        toast.success("Category updated successfully");
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
      });
  };

  useEffect(() => {
    getAllCategories();
    initFlowbite();
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {/* delete modal */}
      <div
        id="deleteModal"
        tabIndex={-1}
        aria-hidden={!isDeleteModalOpen}
        className={`${isDeleteModalOpen ? "flex" : "hidden"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full`}
      >
        <div className="relative p-4 w-full max-w-md h-full md:h-auto">
          <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <button
              type="button"
              className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <svg
              className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="mb-4 text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this item?
            </p>
            <div className="flex justify-center items-center space-x-4">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                No, cancel
              </button>
              <button
                onClick={handleDelete}
                type="submit"
                className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
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

      {/* addCategory modal */}
      <div>
        <div
          id="addCategoryModal"
          tabIndex={-1}
          aria-hidden="hidden"
          className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            {/* Modal content */}
            <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                <h3 className="text-lg font-medium text-heading">
                  Create new category
                </h3>
                <button
                  type="button"
                  className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="addCategoryModal"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18 17.94 6M18 18 6.06 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <form onSubmit={handleAddSubmit(handleAddCategory)}>
                <div className="grid gap-4 grid-cols-2 py-4 md:py-6">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Category name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                      placeholder="Type category name"
                      {...addRegister("name")}
                    />
                    {addErrors.name && (
                      <p className="mt-1 text-sm text-danger">
                        {addErrors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
                      >
                        <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          {...addRegister("image")}
                        />
                      </label>
                    </div>
                    {addErrors.image && (
                      <p className="mt-1 text-sm text-danger">
                        {addErrors.image.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">
                  <button
                    data-modal-hide="addCategoryModal"
                    type="submit"
                    className="inline-flex items-center  text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                  >
                    <svg
                      className="w-4 h-4 me-1.5 -ms-0.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14m-7 7V5"
                      />
                    </svg>
                    Add new category
                  </button>
                  <button
                    data-modal-hide="addCategoryModal"
                    type="button"
                    className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* editCategory modal */}
      <div
        id="editCategoryModal"
        tabIndex={-1}
        aria-hidden={!isEditModalOpen}
        className={`${isEditModalOpen ? "flex" : "hidden"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
              <h3 className="text-lg font-medium text-heading">
                Edit category
              </h3>
              <button
                type="button"
                className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setCategoryEditId(null);
                }}
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <form onSubmit={handleEditSubmit(handleEditCategory)}>
              <div className="grid gap-4 grid-cols-2 py-4 md:py-6">
                <div className="col-span-2">
                  <label
                    htmlFor="edit-name"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Category name
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="Type category name"
                    {...editRegister("name")}
                  />
                  {editErrors.name && (
                    <p className="mt-1 text-sm text-danger">
                      {editErrors.name.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="edit-dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
                    >
                      <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="edit-dropzone-file"
                        type="file"
                        className="hidden"
                        {...editRegister("image")}
                      />
                    </label>
                  </div>
                  {editErrors.image && (
                    <p className="mt-1 text-sm text-danger">
                      {editErrors.image.message}
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
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setCategoryEditId(null);
                  }}
                  className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        <div
          className="absolute top-0 left-0 bg-gray-900/80 w-full h-full -z-10"
          onClick={() => {
            setIsEditModalOpen(false);
            setCategoryEditId(null);
          }}
        ></div>
      </div>

      {/* addCategory Button */}
      <button
        data-modal-target="addCategoryModal"
        data-modal-toggle="addCategoryModal"
        className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none ms-auto me-5 block mb-5 cursor-pointer"
        type="button"
      >
        add Category
      </button>

      <div>
        <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
          <table className="w-full text-sm  text-left  rtl:text-right text-body">
            <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-default-medium">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">
                  Category name
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Image
                </th>
                {/* <th scope="col" className="px-6 py-3 font-medium text-right">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                return (
                  <tr
                    key={category._id}
                    className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium"
                  >
                    <td
                      scope="row"
                      className="px-6 py-4  text-heading whitespace-nowrap"
                    >
                      {category.name}
                    </td>

                    <td className="px-6 py-4">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-40 h-20   "
                      />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEditModal(category)}
                        className="text-white bg-warning box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none cursor-pointer me-2"
                      >
                        Edit
                      </button>
                      <button
                        id="deleteButton"
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setCategoryDeleteId(category._id);
                        }}
                        className="text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none cursor-pointer"
                        type="button"
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
      </div>
    </>
  );
}
