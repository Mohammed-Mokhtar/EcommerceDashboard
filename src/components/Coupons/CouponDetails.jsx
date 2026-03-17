import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function CouponDetails() {
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const formatDate = (value) =>
    value ? new Date(value).toLocaleString() : "-";

  useEffect(() => {
    if (!id) return;
    axios
      .get(`https://nti-ecommerce.vercel.app/api/v1/coupons/${id}`)
      .then((res) => {
        setCoupon(res.data.coupon || res.data.data || res.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.err || err.message);
      });
  }, [id]);

  const expireValue =
    coupon?.expires || coupon?.expire || coupon?.expiryDate || "-";

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-2xl mx-auto bg-neutral-primary-soft border border-default rounded-base shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-heading">Coupon details</h2>
          <Link
            to="/coupons"
            className="text-white bg-neutral-secondary-medium hover:bg-neutral-tertiary-medium border border-default-medium px-4 py-2 rounded-base text-sm"
          >
            Back to coupons
          </Link>
        </div>

        {!coupon ? (
          <p className="text-body">Loading...</p>
        ) : (
          <div className="grid gap-4 grid-cols-2">
            <div className="col-span-2">
              <p className="text-sm text-body">Code</p>
              <p className="text-heading font-medium">{coupon.code}</p>
            </div>

            <div>
              <p className="text-sm text-body">Discount</p>
              <p className="text-heading font-medium">
                {coupon.discount ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-body">Expires</p>
              <p className="text-heading font-medium">{expireValue}</p>
            </div>

            <div>
              <p className="text-sm text-body">Created At</p>
              <p className="text-heading font-medium">
                {formatDate(coupon.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm text-body">Updated At</p>
              <p className="text-heading font-medium">
                {formatDate(coupon.updatedAt)}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-sm text-body">Coupon ID</p>
              <p className="text-heading font-medium">
                {coupon._id || coupon.id || "-"}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
