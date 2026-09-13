import type { Product } from "@/components/layout/Pets/products";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="pet-card">
      <div className="pet-card-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="pet-card-info">
        <h4>{product.name}</h4>
        <p>For: {product.animals.join(", ")}</p>
      </div>
    </div>
  );
}