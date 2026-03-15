import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Products() {
  const hasLoadedRef = useRef(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.categories)) return payload.categories;
    if (Array.isArray(payload?.subCategories)) return payload.subCategories;
    return [];
  };

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadPromise = Promise.all([
      axios.get("https://nti-ecommerce.vercel.app/api/v1/categories"),
      axios.get("https://nti-ecommerce.vercel.app/api/v1/subCategories"),
    ]);

    toast.promise(loadPromise, {
      loading: "Loading products data...",
      success: <b>Products data loaded.</b>,
      error: <b>Unable to load products data.</b>,
    });

    loadPromise
      .then(([categoriesRes, subCategoriesRes]) => {
        setCategories(normalizeList(categoriesRes?.data));
        setSubCategories(normalizeList(subCategoriesRes?.data));
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message ||
            "Failed to load categories and subcategories.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const categoriesCount = useMemo(() => categories.length, [categories]);
  const subCategoriesCount = useMemo(
    () => subCategories.length,
    [subCategories],
  );

  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach((cat) => {
      if (cat?._id) map.set(cat._id, cat);
      else if (cat?.id) map.set(cat.id, cat);
    });
    return map;
  }, [categories]);

  const subCategoryCountByCategory = useMemo(() => {
    const map = new Map();
    subCategories.forEach((subCategory) => {
      const parentId = subCategory?.category;
      if (!parentId) return;
      map.set(parentId, (map.get(parentId) || 0) + 1);
    });
    return map;
  }, [subCategories]);

  const lastUpdated = useMemo(() => {
    const dates = [...categories, ...subCategories]
      .map((item) => item?.updatedAt)
      .filter(Boolean)
      .map((d) => new Date(d).getTime())
      .filter((t) => !Number.isNaN(t));
    if (dates.length === 0) return null;
    const latest = Math.max(...dates);
    return new Date(latest).toLocaleString();
  }, [categories, subCategories]);

  return (
    <div className="px-4 py-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Products Overview
            </h1>
            <p className="text-sm text-gray-600">
              Browse categories and subcategories. Click a category to review
              details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex flex-col rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <span className="text-xs font-semibold uppercase text-gray-500">
                Categories
              </span>
              <span className="text-lg font-bold text-gray-900">
                {categoriesCount}
              </span>
            </div>
            <div className="inline-flex flex-col rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <span className="text-xs font-semibold uppercase text-gray-500">
                Subcategories
              </span>
              <span className="text-lg font-bold text-gray-900">
                {subCategoriesCount}
              </span>
            </div>
            {lastUpdated ? (
              <div className="inline-flex flex-col rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <span className="text-xs font-semibold uppercase text-gray-500">
                  Last updated
                </span>
                <span className="text-sm text-gray-900">{lastUpdated}</span>
              </div>
            ) : null}
          </div>
        </header>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`loading-${idx}`}
                className="h-40 animate-pulse rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 h-4 w-2/3 rounded bg-gray-200" />
                <div className="h-4 w-1/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Categories
                </h2>
              </div>
              {categories.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
                  No categories found.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => {
                    const categoryId = category?._id || category?.id;
                    const relatedCount =
                      subCategoryCountByCategory.get(categoryId) || 0;

                    return (
                      <div
                        key={categoryId}
                        className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        {category?.image ? (
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={category.image}
                              alt={category?.name || "Category image"}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute right-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 shadow">
                              {relatedCount} sub
                            </div>
                          </div>
                        ) : (
                          <div className="h-40 bg-gray-50" />
                        )}

                        <div className="flex flex-1 flex-col gap-3 p-4">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">
                              {category?.name || "Unnamed Category"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {category?.slug || "No slug available"}
                            </p>
                          </div>

                          <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                            <Link
                              to={`/products/${categoryId}`}
                              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            >
                              View category
                            </Link>
                            {relatedCount > 0 ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                                {relatedCount} subcategories
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Subcategories
                </h2>
              </div>
              {subCategories.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
                  No subcategories found.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {subCategories.map((subCategory) => (
                    <div
                      key={subCategory?._id || subCategory?.id}
                      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <h3 className="mb-1 text-base font-semibold text-gray-900">
                        {subCategory?.name || "Unnamed Subcategory"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {subCategory?.slug || "No slug available"}
                      </p>
                      <Link
                        to={`/products/subcategory/${subCategory?._id || subCategory?.id}`}
                        className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
