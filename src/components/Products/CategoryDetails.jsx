import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function CategoryDetails() {
  const { id } = useParams();
  const previousIdRef = useRef(null);
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    if (previousIdRef.current === id) return;
    previousIdRef.current = id;

    const categoryPromise = axios.get(
      `https://nti-ecommerce.vercel.app/api/v1/categories/${id}`,
    );
    const subCategoryPromise = axios.get(
      `https://nti-ecommerce.vercel.app/api/v1/subCategories?category=${id}`,
    );

    toast.promise(
      Promise.all([categoryPromise, subCategoryPromise]),
      {
        loading: "Loading category details...",
        success: <b>Category details loaded.</b>,
        error: <b>Unable to load category details.</b>,
      },
    );

    Promise.all([categoryPromise, subCategoryPromise])
      .then(([categoryRes, subCategoryRes]) => {
        const payload = categoryRes?.data || {};
        const maybeCategory =
          payload.Category ??
          payload.category ??
          payload.data ??
          payload.result ??
          payload;

        if (Array.isArray(maybeCategory)) {
          setCategory(maybeCategory[0] ?? null);
        } else if (maybeCategory && typeof maybeCategory === "object") {
          setCategory(maybeCategory);
        } else {
          setCategory(null);
        }

        const subPayload = subCategoryRes?.data || {};
        const subList =
          subPayload.categories ?? subPayload.subCategories ?? subPayload.data ?? [];
        setSubCategories(Array.isArray(subList) ? subList : []);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message || "Failed to load category details.",
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  const subCategoryList = useMemo(() => {
    if (subCategories.length > 0) return subCategories;
    if (Array.isArray(category?.subCategories)) return category.subCategories;
    if (Array.isArray(category?.subcategories)) return category.subcategories;
    return [];
  }, [category, subCategories]);

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
        ) : category ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row">
              {category?.image ? (
                <div className="flex-shrink-0">
                  <img
                    src={category.image}
                    alt={category?.name || "Category"}
                    className="h-56 w-full max-w-sm rounded-lg object-cover"
                    loading="lazy"
                  />
                </div>
              ) : null}

              <div className="flex-1">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {category?.name || "Category Details"}
                  </h1>
                  {category?.slug ? (
                    <p className="text-sm text-gray-500">/{category.slug}</p>
                  ) : (
                    <p className="text-sm text-gray-500">No slug available</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Metadata
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                      <p>
                        <span className="font-semibold">ID:</span>{" "}
                        {category?._id || category?.id || "Unknown"}
                      </p>
                      <p>
                        <span className="font-semibold">Created:</span>{" "}
                        {category?.createdAt
                          ? new Date(category.createdAt).toLocaleString()
                          : "Unknown"}
                      </p>
                      <p>
                        <span className="font-semibold">Updated:</span>{" "}
                        {category?.updatedAt
                          ? new Date(category.updatedAt).toLocaleString()
                          : "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Subcategories
                    </p>
                    {subCategoryList.length === 0 ? (
                      <p className="mt-3 text-sm text-gray-600">
                        No subcategories available for this category.
                      </p>
                    ) : (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {subCategoryList.map((subCategory) => (
                          <span
                            key={subCategory?._id || subCategory?.id}
                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                          >
                            {subCategory?.name || "Unnamed"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
            Category not found.
          </div>
        )}
      </div>
    </div>
  );
}
