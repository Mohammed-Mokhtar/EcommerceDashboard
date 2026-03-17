import React, { useEffect, useState } from "react";
import axios from "axios";
import { initFlowbite } from "flowbite";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const productSchema = z.object({
  title: z
    .string()
    .min(3, "title minimum length is 3 characters")
    .max(100, "title maximum length is 100 characters"),
  description: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) => !val || (val.length >= 5 && val.length <= 500),
      "description minimum length is 5 characters",
    ),
  price: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const parsed = Number(val);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, z.number().positive("price must be a positive number").optional()),
  stock: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const parsed = Number(val);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, z.number().int().min(0, "stock must be 0 or greater").optional()),
  category: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  brand: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  subCategory: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  imageCover: z.any().optional(),
  images: z.any().optional(),
});

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productDeleteId, setProductDeleteId] = useState(null);
  const [productEditId, setProductEditId] = useState(null);

  const {
    register: addRegister,
    handleSubmit: handleAddSubmit,
    reset: resetAddForm,
    formState: { errors: addErrors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      brand: "",
      subCategory: "",
      imageCover: "",
      images: "",
    },
    resolver: zodResolver(productSchema),
  });

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    setValue: setEditValue,
    reset: resetEditForm,
    formState: { errors: editErrors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      brand: "",
      subCategory: "",
      imageCover: "",
      images: "",
    },
    resolver: zodResolver(productSchema),
  });

  const getCategoryNameById = (id) => {
    const category = categories.find((cat) => cat._id === id || cat.id === id);
    return category?.name;
  };

  const getSubCategoryNameById = (id) => {
    const sub = subCategories.find((s) => s._id === id || s.id === id);
    return sub?.name;
  };

  const getBrandNameById = (id) => {
    const brand = brands.find((b) => b._id === id || b.id === id);
    return brand?.name;
  };

  const getAllProducts = () => {
    axios
      .get("https://nti-ecommerce.vercel.app/api/v1/products")
      .then((res) => {
        const payload =
          res.data?.Products ||
          res.data?.products ||
          res.data?.data ||
          res.data?.items ||
          res.data;
        setProducts(Array.isArray(payload) ? payload : []);
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
        setProducts([]);
      });
  };

  const getAllCategories = () => {
    axios
      .get("https://nti-ecommerce.vercel.app/api/v1/categories")
      .then((res) => {
        setCategories(res.data.categories || []);
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
        setCategories([]);
      });
  };

  const getAllSubCategories = () => {
    axios
      .get("https://nti-ecommerce.vercel.app/api/v1/subCategories")
      .then((res) => {
        setSubCategories(res.data.categories || []);
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
        setSubCategories([]);
      });
  };

  const getAllBrands = () => {
    axios
      .get("https://nti-ecommerce.vercel.app/api/v1/brands")
      .then((res) => {
        setBrands(res.data.brands || []);
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
        setBrands([]);
      });
  };

  const handleAddProduct = (data) => {
    const token = localStorage.getItem("token");
    if (!data.imageCover || !data.imageCover[0]) {
      toast.error("Image cover is required by the backend");
      return;
    }
    let formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.price !== undefined) formData.append("price", data.price);
    if (data.stock !== undefined) formData.append("stock", data.stock);
    if (data.category) formData.append("category", data.category);
    if (data.brand) formData.append("brand", data.brand);
    if (data.subCategory) formData.append("subCategory", data.subCategory);
    if (data.imageCover && data.imageCover[0]) {
      formData.append("imageCover", data.imageCover[0]);
    }
    const hasImages = data.images && data.images.length;
    if (hasImages) {
      Array.from(data.images).forEach((file) => {
        formData.append("images", file);
      });
    } else if (data.imageCover && data.imageCover[0]) {
      formData.append("images", data.imageCover[0]);
    }

    axios
      .post("https://nti-ecommerce.vercel.app/api/v1/products", formData, {
        headers: token
          ? { Authorization: `Bearer ${token}`, token: token }
          : undefined,
      })
      .then(() => {
        getAllProducts();
        toast.success("Product added successfully");
        resetAddForm();
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
      });
  };

  const handleDelete = () => {
    if (!productDeleteId) return;
    const token = localStorage.getItem("token");
    axios
      .delete(
        `https://nti-ecommerce.vercel.app/api/v1/products/${productDeleteId}`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}`, token: token }
            : undefined,
        },
      )
      .then(() => {
        setIsDeleteModalOpen(false);
        getAllProducts();
        setProductDeleteId(null);
        toast.success("Product deleted successfully");
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
      });
  };

  const openEditModal = (product) => {
    const productId = product._id || product.id;
    setProductEditId(productId);
    setEditValue("title", product.title || "");
    setEditValue("description", product.description || "");
    setEditValue("price", product.price || "");
    setEditValue("stock", product.stock || "");
    setEditValue(
      "category",
      product.category?._id || product.category || "",
    );
    setEditValue("brand", product.brand?._id || product.brand || "");
    setEditValue(
      "subCategory",
      product.subCategory?._id || product.subCategory || "",
    );
    setIsEditModalOpen(true);
  };

  const handleEditProduct = (data) => {
    if (!productEditId) return;
    const token = localStorage.getItem("token");

    let formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.price !== undefined) formData.append("price", data.price);
    if (data.stock !== undefined) formData.append("stock", data.stock);
    if (data.category) formData.append("category", data.category);
    if (data.brand) formData.append("brand", data.brand);
    if (data.subCategory) formData.append("subCategory", data.subCategory);
    if (data.imageCover?.[0]) {
      formData.append("imageCover", data.imageCover[0]);
    }
    const hasImages = data.images && data.images.length;
    if (hasImages) {
      Array.from(data.images).forEach((file) => {
        formData.append("images", file);
      });
    } else if (data.imageCover && data.imageCover[0]) {
      formData.append("images", data.imageCover[0]);
    }

    axios
      .put(
        `https://nti-ecommerce.vercel.app/api/v1/products/${productEditId}`,
        formData,
        {
          headers: token
            ? { Authorization: `Bearer ${token}`, token: token }
            : undefined,
        },
      )
      .then(() => {
        setIsEditModalOpen(false);
        setProductEditId(null);
        resetEditForm();
        getAllProducts();
        toast.success("Product updated successfully");
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
      });
  };

  useEffect(() => {
    getAllProducts();
    getAllCategories();
    getAllBrands();
    getAllSubCategories();
    initFlowbite();
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {/* delete modal */}
      <div
        id="deleteProductModal"
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

      {/* addProduct modal */}
      <div>
        <div
          id="addProductModal"
          tabIndex={-1}
          aria-hidden="hidden"
          className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                <h3 className="text-lg font-medium text-heading">
                  Create new product
                </h3>
                <button
                  type="button"
                  className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="addProductModal"
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
              <form onSubmit={handleAddSubmit(handleAddProduct)}>
                <div className="grid gap-4 grid-cols-2 py-4 md:py-6">
                  <div className="col-span-2">
                    <label
                      htmlFor="product-title"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Product title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="product-title"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                      placeholder="Type product title"
                      {...addRegister("title")}
                    />
                    {addErrors.title && (
                      <p className="mt-1 text-sm text-danger">
                        {addErrors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="product-description"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Description
                    </label>
                    <textarea
                      id="product-description"
                      rows={4}
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                      placeholder="Type product description"
                      {...addRegister("description")}
                    />
                    {addErrors.description && (
                      <p className="mt-1 text-sm text-danger">
                        {addErrors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="product-price"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      id="product-price"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                      placeholder="0"
                      {...addRegister("price")}
                    />
                    {addErrors.price && (
                      <p className="mt-1 text-sm text-danger">
                        {addErrors.price.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="product-stock"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Stock
                    </label>
                    <input
                      type="number"
                      id="product-stock"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                      placeholder="0"
                      {...addRegister("stock")}
                    />
                    {addErrors.stock && (
                      <p className="mt-1 text-sm text-danger">
                        {addErrors.stock.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="product-category"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Category
                    </label>
                    <select
                      id="product-category"
                      className="block w-full bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs"
                      {...addRegister("category")}
                    >
                      <option value="">Select category</option>
                      {(categories || []).map((category) => (
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

                  <div className="col-span-1">
                    <label
                      htmlFor="product-subcategory"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Subcategory
                    </label>
                    <select
                      id="product-subcategory"
                      className="block w-full bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs"
                      {...addRegister("subCategory")}
                    >
                      <option value="">Select subcategory</option>
                      {(subCategories || []).map((sub) => (
                        <option
                          key={sub?._id || sub?.id}
                          value={sub?._id || sub?.id}
                        >
                          {sub?.name}
                        </option>
                      ))}
                    </select>
                    {addErrors.subCategory && (
                      <p className="mt-1 text-sm text-danger">
                        {addErrors.subCategory.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="product-brand"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Brand (optional)
                    </label>
                    <select
                      id="product-brand"
                      className="block w-full bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs"
                      {...addRegister("brand")}
                    >
                      <option value="">Select brand</option>
                      {(brands || []).map((brand) => (
                        <option
                          key={brand?._id || brand?.id}
                          value={brand?._id || brand?.id}
                        >
                          {brand?.name}
                        </option>
                      ))}
                    </select>
                    {addErrors.brand && (
                      <p className="mt-1 text-sm text-danger">
                        {addErrors.brand.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="product-image-cover"
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
                          id="product-image-cover"
                          type="file"
                          className="hidden"
                          {...addRegister("imageCover")}
                        />
                      </label>
                    </div>
                    {addErrors.imageCover && (
                      <p className="mt-1 text-sm text-danger">
                        {addErrors.imageCover.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="product-images"
                        className="flex flex-col items-center justify-center w-full h-40 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
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
                          <p className="text-xs">Multiple images allowed</p>
                        </div>
                        <input
                          id="product-images"
                          type="file"
                          multiple
                          className="hidden"
                          {...addRegister("images")}
                        />
                      </label>
                    </div>
                    {addErrors.images && (
                      <p className="mt-1 text-sm text-danger">
                        {addErrors.images.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">
                  <button
                    data-modal-hide="addProductModal"
                    type="submit"
                    className="inline-flex items-center text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                  >
                    Add new product
                  </button>
                  <button
                    data-modal-hide="addProductModal"
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

      {/* editProduct modal */}
      <div
        id="editProductModal"
        tabIndex={-1}
        aria-hidden={!isEditModalOpen}
        className={`${isEditModalOpen ? "flex" : "hidden"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
              <h3 className="text-lg font-medium text-heading">Edit product</h3>
              <button
                type="button"
                className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setProductEditId(null);
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

            <form onSubmit={handleEditSubmit(handleEditProduct)}>
              <div className="grid gap-4 grid-cols-2 py-4 md:py-6">
                <div className="col-span-2">
                  <label
                    htmlFor="edit-product-title"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Product title
                  </label>
                  <input
                    type="text"
                    id="edit-product-title"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="Type product title"
                    {...editRegister("title")}
                  />
                  {editErrors.title && (
                    <p className="mt-1 text-sm text-danger">
                      {editErrors.title.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="edit-product-description"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Description
                  </label>
                  <textarea
                    id="edit-product-description"
                    rows={4}
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="Type product description"
                    {...editRegister("description")}
                  />
                  {editErrors.description && (
                    <p className="mt-1 text-sm text-danger">
                      {editErrors.description.message}
                    </p>
                  )}
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="edit-product-price"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="edit-product-price"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="0"
                    {...editRegister("price")}
                  />
                  {editErrors.price && (
                    <p className="mt-1 text-sm text-danger">
                      {editErrors.price.message}
                    </p>
                  )}
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="edit-product-stock"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    id="edit-product-stock"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="0"
                    {...editRegister("stock")}
                  />
                  {editErrors.stock && (
                    <p className="mt-1 text-sm text-danger">
                      {editErrors.stock.message}
                    </p>
                  )}
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="edit-product-category"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Category
                  </label>
                  <select
                    id="edit-product-category"
                    className="block w-full bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs"
                    {...editRegister("category")}
                  >
                    <option value="">Select category</option>
                    {(categories || []).map((category) => (
                      <option
                        key={category?._id || category?.id}
                        value={category?._id || category?.id}
                      >
                        {category?.name}
                      </option>
                    ))}
                  </select>
                  {editErrors.category && (
                    <p className="mt-1 text-sm text-danger">
                      {editErrors.category.message}
                    </p>
                  )}
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="edit-product-subcategory"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Subcategory
                  </label>
                  <select
                    id="edit-product-subcategory"
                    className="block w-full bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs"
                    {...editRegister("subCategory")}
                  >
                    <option value="">Select subcategory</option>
                    {(subCategories || []).map((sub) => (
                      <option
                        key={sub?._id || sub?.id}
                        value={sub?._id || sub?.id}
                      >
                        {sub?.name}
                      </option>
                    ))}
                  </select>
                  {editErrors.subCategory && (
                    <p className="mt-1 text-sm text-danger">
                      {editErrors.subCategory.message}
                    </p>
                  )}
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="edit-product-brand"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Brand (optional)
                  </label>
                  <select
                    id="edit-product-brand"
                    className="block w-full bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs"
                    {...editRegister("brand")}
                  >
                    <option value="">Select brand</option>
                    {(brands || []).map((brand) => (
                      <option
                        key={brand?._id || brand?.id}
                        value={brand?._id || brand?.id}
                      >
                        {brand?.name}
                      </option>
                    ))}
                  </select>
                  {editErrors.brand && (
                    <p className="mt-1 text-sm text-danger">
                      {editErrors.brand.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="edit-product-image-cover"
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
                        id="edit-product-image-cover"
                        type="file"
                        className="hidden"
                        {...editRegister("imageCover")}
                      />
                    </label>
                  </div>
                  {editErrors.imageCover && (
                    <p className="mt-1 text-sm text-danger">
                      {editErrors.imageCover.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="edit-product-images"
                      className="flex flex-col items-center justify-center w-full h-40 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
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
                        <p className="text-xs">Multiple images allowed</p>
                      </div>
                      <input
                        id="edit-product-images"
                        type="file"
                        multiple
                        className="hidden"
                        {...editRegister("images")}
                      />
                    </label>
                  </div>
                  {editErrors.images && (
                    <p className="mt-1 text-sm text-danger">
                      {editErrors.images.message}
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
                    setProductEditId(null);
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
            setProductEditId(null);
          }}
        ></div>
      </div>

      {/* addProduct Button */}
      <button
        data-modal-target="addProductModal"
        data-modal-toggle="addProductModal"
        className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none ms-auto me-5 block mb-5 cursor-pointer"
        type="button"
      >
        Add Product
      </button>

      <div>
        <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
          <table className="w-full text-sm text-left rtl:text-right text-body">
            <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-default-medium">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Subcategory
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {(products || []).map((product) => {
                const rowId = product._id || product.id;
                const categoryName =
                  product.category?.name ||
                  getCategoryNameById(product.category);
                const subCategoryName =
                  product.subCategory?.name ||
                  getSubCategoryNameById(product.subCategory);
                const brandName =
                  product.brand?.name || getBrandNameById(product.brand);
                const imageSrc =
                  product.image ||
                  product.imageCover ||
                  product.thumbnail ||
                  (Array.isArray(product.images) ? product.images[0] : undefined);

                return (
                  <tr
                    key={rowId}
                    onClick={() => {
                      window.location.href = `/products/${rowId}`;
                    }}
                    className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium"
                  >
                    <td className="px-6 py-4 text-heading whitespace-nowrap">
                      {product.title || product.name}
                    </td>
                    <td className="px-6 py-4">{categoryName || "-"}</td>
                    <td className="px-6 py-4">
                      {subCategoryName || "-"}
                      {brandName ? ` / ${brandName}` : ""}
                    </td>
                    <td className="px-6 py-4">{product.price}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      {imageSrc && (
                        <img
                          src={imageSrc}
                          alt={product.title || product.name}
                          className="w-20 h-14 object-cover"
                        />
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/products/${rowId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-white bg-info box-border border border-transparent hover:bg-info-strong focus:ring-4 focus:ring-info-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none cursor-pointer me-2 inline-block"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(product);
                        }}
                        className="text-white bg-warning box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none cursor-pointer me-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDeleteModalOpen(true);
                          setProductDeleteId(rowId);
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
