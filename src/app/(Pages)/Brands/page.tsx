"use client";

import React, { useEffect, useState } from "react";
import Product from "@/components/Product/Product"; // adjust the import path if needed

interface Brand {
  _id: string;
  name: string;
  image: string;
  slug: string;
}

interface BrandDetails {
  data: {
    _id: string;
    name: string;
    image: string;
    slug: string;
  };
}

interface ProductI {
  _id: string;
  title: string;
  imageCover: string;
  brand: { name: string };
  category: { name: string };
  price: number;
  ratingsAverage: number;
  ratingsQuantity: number;
}

export default function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<BrandDetails | null>(null);
  const [products, setProducts] = useState<ProductI[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all brands
  useEffect(() => {
    async function fetchBrands() {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/brands");
      const data = await res.json();
      setBrands(data.data);
    }
    fetchBrands();
  }, []);

  // Fetch brand details + products
  async function fetchBrandData(id: string) {
    setLoading(true);
    setSelectedBrand(null);
    setProducts([]);

    // brand details
    const brandRes = await fetch(
      `https://ecommerce.routemisr.com/api/v1/brands/${id}`
    );
    const brandData = await brandRes.json();
    setSelectedBrand(brandData);

    // brand products
    const productRes = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products?brand=${id}`
    );
    const productData = await productRes.json();
    setProducts(productData.data);

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r p-4 
                h-screen sticky top-0 
                overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Brands</h2>
        <ul className="space-y-2">
          {brands.map((brand) => (
            <li
              key={brand._id}
              className="cursor-pointer p-2 rounded hover:bg-gray-200 flex items-center gap-2"
              onClick={() => fetchBrandData(brand._id)}
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="w-8 h-8 object-contain"
              />
              <span>{brand.name}</span>
            </li>
          ))}
        </ul>
      </aside>


      {/* Main Content */}
      <main className="flex-1 p-6">
        {loading && <p className="text-gray-500">Loading...</p>}

        {/* Brand Details */}
        {selectedBrand && (
          <div className="border rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {selectedBrand.data.name}
            </h2>
            <img
              src={selectedBrand.data.image}
              alt={selectedBrand.data.name}
              className="w-40 h-40 object-contain mb-4"
            />
            <p className="text-gray-500">Slug: {selectedBrand.data.slug}</p>
          </div>
        )}

        {/* Products */}
        {products.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Products ({products.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <Product
                  key={p._id}
                  title={p.title}
                  image={p.imageCover}
                  brand={p.brand.name}
                  category={p.category.name}
                  price={p.price}
                  ratingsAverage={p.ratingsAverage}
                  ratingsQuantity={p.ratingsQuantity}
                  ID={p._id}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && !selectedBrand && (
          <p className="text-gray-500">
            Select a brand from the sidebar to view details and products.
          </p>
        )}
      </main>
    </div>
  );
}
