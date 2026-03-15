import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function SubCategoryDetails() {
  const { id } = useParams();
  const previousIdRef = useRef(null);
  const [subCategory, setSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    if (previousIdRef.current === id) return;
    previousIdRef.current = id;

    const loadPromise = axios.get(
      `https://nti-ecommerce.vercel.app/api/v1/subCategories/${id}`,
    );

    toast.promise(loadPromise, {
      loading: "Loading subcategory details...",
      success: <b>Subcategory details loaded.</b>,
      error: <b>Unable to load subcategory details.</b>,
    });

    loadPromise
      .then((res) => {
        const payload = res?.data || {};
        const maybeSubCategory =
          payload.subCategory ?? payload.subcategory ?? payload.data ?? payload;

        if (Array.isArray(maybeSubCategory)) {
          setSubCategory(maybeSubCategory[0] ?? null);
        } else if (maybeSubCategory && typeof maybeSubCategory === "object") {
          setSubCategory(maybeSubCategory);
        } else {
          setSubCategory(null);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message || "Failed to load subcategory details.",
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="px-4 py-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="mx-auto w-full max-w-4xl">
        <Link
          to="/products"
          className="mb-6 inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
        >
          Back to Products
        </Link>

        {loading ? (
          <div className="h-48 animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 h-4 w-2/3 rounded bg-gray-200" />
            <div className="h-4 w-1/3 rounded bg-gray-200" />
          </div>
        ) : subCategory ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {subCategory?.name || "Subcategory Details"}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  {subCategory?.slug
                    ? `/${subCategory.slug}`
                    : "No slug available"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  ID: {subCategory?._id || subCategory?.id || "Unknown"}
                </span>
                {subCategory?.category ? (
                  <Link
                    to={`/products/${subCategory.category}`}
                    className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    View parent category
                  </Link>
                ) : null}
              </div>
            </header>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Overview
                </p>
                <dl className="mt-3 grid gap-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <dt className="font-medium">Name</dt>
                    <dd className="text-right">
                      {subCategory?.name || "Unknown"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Slug</dt>
                    <dd className="text-right">
                      {subCategory?.slug || "Unknown"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Category</dt>
                    <dd className="text-right">
                      {subCategory?.category || "Unknown"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Timestamps
                </p>
                <dl className="mt-3 grid gap-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <dt className="font-medium">Created</dt>
                    <dd className="text-right">
                      {subCategory?.createdAt
                        ? new Date(subCategory.createdAt).toLocaleString()
                        : "Unknown"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Updated</dt>
                    <dd className="text-right">
                      {subCategory?.updatedAt
                        ? new Date(subCategory.updatedAt).toLocaleString()
                        : "Unknown"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Actions
                </p>
                <div className="mt-3 space-y-3 text-sm">
                  <Link
                    to="/products"
                    className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Back to products
                  </Link>
                  {subCategory?.category ? (
                    <Link
                      to={`/products/${subCategory.category}`}
                      className="inline-flex w-full items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                    >
                      View parent category
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
            Subcategory not found.
          </div>
        )}
      </div>
    </div>
  );
}
