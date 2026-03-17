import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function BrandDetails() {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const formatDate = (value) =>
    value ? new Date(value).toLocaleString() : "-";

  useEffect(() => {
    if (!id) return;
    axios
      .get(`https://nti-ecommerce.vercel.app/api/v1/brands/${id}`)
      .then((res) => {
        setBrand(res.data.Brand || res.data.brand || res.data.data || res.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
      });
  }, [id]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-2xl mx-auto bg-neutral-primary-soft border border-default rounded-base shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-heading">Brand details</h2>
          <Link
            to="/brands"
            className="text-white bg-neutral-secondary-medium hover:bg-neutral-tertiary-medium border border-default-medium px-4 py-2 rounded-base text-sm"
          >
            Back to brands
          </Link>
        </div>

        {!brand ? (
          <p className="text-body">Loading...</p>
        ) : (
          <div className="grid gap-4 grid-cols-2">
            <div className="col-span-2">
              <p className="text-sm text-body">Name</p>
              <p className="text-heading font-medium">{brand.name}</p>
            </div>

            <div>
              <p className="text-sm text-body">Slug</p>
              <p className="text-heading font-medium">{brand.slug || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-body">Brand ID</p>
              <p className="text-heading font-medium">
                {brand._id || brand.id || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-body">Created At</p>
              <p className="text-heading font-medium">
                {formatDate(brand.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm text-body">Updated At</p>
              <p className="text-heading font-medium">
                {formatDate(brand.updatedAt)}
              </p>
            </div>

            {brand.image && (
              <div className="col-span-2">
                <p className="text-sm text-body mb-2">Image</p>
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full max-w-md h-40 object-contain rounded-base border border-default"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
