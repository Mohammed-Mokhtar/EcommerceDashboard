import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categoryMap, setCategoryMap] = useState({});
  const [subCategoryMap, setSubCategoryMap] = useState({});
  const [brandMap, setBrandMap] = useState({});
  const formatDate = (value) =>
    value ? new Date(value).toLocaleString() : "-";

  useEffect(() => {
    if (!id) return;
    axios
      .get(`https://nti-ecommerce.vercel.app/api/v1/products/${id}`)
      .then((res) => {
        setProduct(
          res.data.Product || res.data.product || res.data.data || res.data,
        );
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get("https://nti-ecommerce.vercel.app/api/v1/categories")
      .then((res) => {
        const list = res.data?.categories || [];
        const map = {};
        list.forEach((item) => {
          map[item._id || item.id] = item.name;
        });
        setCategoryMap(map);
      })
      .catch(() => {});

    axios
      .get("https://nti-ecommerce.vercel.app/api/v1/subCategories")
      .then((res) => {
        const list = res.data?.categories || [];
        const map = {};
        list.forEach((item) => {
          map[item._id || item.id] = item.name;
        });
        setSubCategoryMap(map);
      })
      .catch(() => {});

    axios
      .get("https://nti-ecommerce.vercel.app/api/v1/brands")
      .then((res) => {
        const list = res.data?.brands || [];
        const map = {};
        list.forEach((item) => {
          map[item._id || item.id] = item.name;
        });
        setBrandMap(map);
      })
      .catch(() => {});
  }, []);

  const imageSrc =
    product?.imageCover ||
    product?.image ||
    product?.thumbnail ||
    (Array.isArray(product?.images) ? product?.images[0] : undefined);
  const galleryImages = Array.isArray(product?.images) ? product.images : [];
  const categoryName =
    product?.category?.name ||
    categoryMap[product?.category] ||
    product?.category ||
    "-";
  const subCategoryName =
    product?.subCategory?.name ||
    subCategoryMap[product?.subCategory] ||
    product?.subCategory ||
    "-";
  const brandName =
    product?.brand?.name ||
    brandMap[product?.brand] ||
    product?.brand ||
    "-";

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-3xl mx-auto bg-neutral-primary-soft border border-default rounded-base shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-heading">Product details</h2>
          <Link
            to="/products"
            className="text-white bg-neutral-secondary-medium hover:bg-neutral-tertiary-medium border border-default-medium px-4 py-2 rounded-base text-sm"
          >
            Back to products
          </Link>
        </div>

        {!product ? (
          <p className="text-body">Loading...</p>
        ) : (
          <div className="grid gap-4 grid-cols-2">
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-heading">
                {product.title || product.name}
              </h3>
              <p className="text-body mt-1">{product.description || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-body">Price</p>
              <p className="text-heading font-medium">
                {product.price ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-body">Price After Discount</p>
              <p className="text-heading font-medium">
                {product.priceAfterDiscount ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-body">Stock</p>
              <p className="text-heading font-medium">
                {product.stock ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-body">Sold</p>
              <p className="text-heading font-medium">{product.sold ?? "-"}</p>
            </div>

            <div>
              <p className="text-sm text-body">Rating Avg</p>
              <p className="text-heading font-medium">
                {product.ratingAvg ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-body">Category</p>
              <p className="text-heading font-medium">{categoryName}</p>
            </div>

            <div>
              <p className="text-sm text-body">Subcategory</p>
              <p className="text-heading font-medium">{subCategoryName}</p>
            </div>

            <div>
              <p className="text-sm text-body">Brand</p>
              <p className="text-heading font-medium">{brandName}</p>
            </div>

            <div>
              <p className="text-sm text-body">Slug</p>
              <p className="text-heading font-medium">{product.slug || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-body">Created At</p>
              <p className="text-heading font-medium">
                {formatDate(product.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm text-body">Updated At</p>
              <p className="text-heading font-medium">
                {formatDate(product.updatedAt)}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-sm text-body mb-2">Image Cover</p>
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={product.title || product.name}
                  className="w-full max-w-md h-56 object-cover rounded-base border border-default"
                />
              ) : (
                <p className="text-body">-</p>
              )}
            </div>

            <div className="col-span-2">
              <p className="text-sm text-body mb-2">Gallery</p>
              {galleryImages.length ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {galleryImages.map((img, index) => (
                    <img
                      key={`${img}-${index}`}
                      src={img}
                      alt={`${product.title || product.name} ${index + 1}`}
                      className="w-full h-28 object-cover rounded-base border border-default"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-body">-</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
