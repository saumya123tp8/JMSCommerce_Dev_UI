import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { Prices } from "../components/Prices";
// import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
// import Layout from "./../components/Layout/Layout";
import { Sliders } from "lucide-react";
import { Button } from "@base-ui/react/button";
import { useDispatch } from "react-redux";
import { decrement, increment } from "../redux/slices/counterSlice";
import { useAppSelector } from "../redux/hooks";
import Layout from "@/components/layout/Layout";
// import ProductCard from "../components/ProductCard/ProductCard";
// import FilterBar from "../components/FilterBar/FilterBar";
// import Slider from "react-slick";
// import "./slick-overrides.css"; // see note at bottom of chat — required for react-slick's own DOM nodes
// import Customiz
// eProductCard from "../components/ProductCard/CustomizeProductCard";
// import { useAuth } from "../context/auth";
// import CustomizeDeleteProductCard from "../components/ProductCard/CustomizeDeleteProduct";

// ── Types ────────────────────────────────────────────────────────────────
// Loosened with index signatures since ProductCard / FilterBar / Prices
// aren't converted yet. Tighten these once those files are typed too.
import { getAllCategories } from "@/Service/CategoryServices";
import type { Category } from "@/types/category";

interface Customization {
  notes: string;
  thickness: string;
  sweetness: string;
  coffeeStrength: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  [key: string]: any;
}

interface CartItem extends Product {
  productId: string;
  cartQuantity: number;
  cartItemId: number;
  customization?: Customization;
  addedOrUpdatedToCartAt?: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  // `useCart`/`useAuth` aren't typed yet — cast here until context/cart.tsx
  // and context/auth.tsx (already typed) both export proper generics.
  // const [cart, setCart] = useCart() as [CartItem[], React.Dispatch<React.SetStateAction<CartItem[]>>];
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [slideProducts, setSlideProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [radio, setRadio] = useState<number[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [buy, setBuy] = useState<Record<string, number>>({});
  const [slidesToShow, setSlidesToShow] = useState<number>(6);

  // const [auth, setAuth] = useAuth();
  const auth = useAppSelector((state) => state.auth);

  // ── all your existing logic unchanged ────────────────────────────────────

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
  };

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 760) setSlidesToShow(3);
      else if (w < 992) setSlidesToShow(5);
      else setSlidesToShow(7);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initializeBuy = () => {
    const buyState: Record<string, number> = {};

    // cart.forEach((item) => {
    //   const productId = item.productId;
    //   const qty = item.cartQuantity || 0;

    //   // If product already exists, add quantity
    //   if (buyState[productId]) {
    //     buyState[productId] += qty;
    //   } else {
    //     buyState[productId] = qty;
    //   }
    // });

    // setBuy(buyState);
  };
  useEffect(() => {
    initializeBuy();
  }, [cart]);

  const increaseQuantity = (pid: string) =>
    setBuy((prev) => ({ ...prev, [pid]: (prev[pid] || 0) + 1 }));

  const decreaseQuantity = (pid: string) =>
    setBuy((prev) => ({ ...prev, [pid]: Math.max((prev[pid] || 0) - 1, 0) }));

  const getAllCategory = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data.filter((category) => category.status === "ACTIVE"));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllAvlProducts();
    getAllCategory();
    getTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
      setSlideProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getAllAvlProducts = async () => {
    try {
      let currentPage = 1;
      let allProducts: Product[] = [];
      while (allProducts.length < total) {
        const { data } = await axios.get(
          `/api/v1/product/product-list/${currentPage}`,
        );
        allProducts = [...allProducts, ...data.products];
        currentPage++;
      }
      setSlideProducts(allProducts);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/product-count`);
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleFilter = (value: boolean, id: string) => {
    let all = [...checked];
    if (value) all.push(id);
    else all = all.filter((c) => c !== id);
    setChecked(all);
  };

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
    else getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, radio]);

  const filterProduct = async () => {
    try {
      const { data } = await axios.post(`/api/v1/product/product-filters`, {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  const handleAdd = (p: CartItem) => {
    try {
      // Compare customization dynamically
      // Ignore fields like "notes"
      const isSameCustomization = (c1: Partial<Customization> = {}, c2: Partial<Customization> = {}) => {
        const clean1 = Object.entries(c1)
          .filter(([key]) => key !== "notes")
          .sort();

        const clean2 = Object.entries(c2)
          .filter(([key]) => key !== "notes")
          .sort();

        return JSON.stringify(clean1) === JSON.stringify(clean2);
      };

      // Find existing cart item
      const existingIndex = cart.findIndex((item) => {
        return (
          item.productId === p.productId &&
          isSameCustomization(item.customization, p.customization)
        );
      });

      let updatedCart = [...cart];

      // Product already exists
      if (existingIndex !== -1) {
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],

          // increase cart quantity
          cartQuantity: (updatedCart[existingIndex].cartQuantity || 1) + p.cartQuantity,
        };

        toast.success("Quantity updated");
      } else {
        // Add new item
        updatedCart.push({
          ...p,
        });

        toast.success("Added to cart");
      }

      // Update state
      setCart(updatedCart);

      // Save user-specific cart
      // const cartKey = `cart_${auth.user?._id}`;
      const cartKey = 'abcd';
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));

      console.log("Updated cart:", updatedCart);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleRemove = (p: Product) => {
    setDelProductId(p?._id);
    setShowCustomizationDelete(true);
  };

  const updatedProductAfterReload = () => {
    cart?.forEach((item) => {
      increaseQuantity(item._id);
    });
  };
  // ── end of your existing logic ──

  const openCustomizationModal = (product: Product) => {
    setCurrentProduct(product);
    // Reset customization for new product
    setCustomization({
      notes: "",
      thickness: "",
      sweetness: "",
      coffeeStrength: "",
    });
    setShowCustomizationModal(true);
  };

  const closeCustomizationModal = () => {
    setShowCustomizationModal(false);
    setCurrentProduct(null);
  };
  const closeCustomizationDelete = () => {
    setShowCustomizationDelete(false);
    setDelProductId(null);
  };

  const confirmCustomization = (product: Product, selectedQuantity: number) => {
    const cartItem: CartItem = {
      ...(product as Product), // keep for UI (name, image, etc.)
      productId: product._id, // important for backend
      customization: { ...customization },
      cartItemId: Date.now(), // unique id for each customization
      cartQuantity: selectedQuantity,
      addedOrUpdatedToCartAt: Date.now(),
    };

    handleAdd(cartItem);
    // Close modal
    // closeCustomizationModal();
  };

  const [showCustomizationModal, setShowCustomizationModal] = useState<boolean>(false);
  const [showCustomizationDelete, setShowCustomizationDelete] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [delProductId, setDelProductId] = useState<string | null>("");
  const [customization, setCustomization] = useState<Customization>({
    notes: "",
    thickness: "",
    sweetness: "",
    coffeeStrength: "",
  });
  const counter = useAppSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <Layout title={"All Products - Best offers"}>
      <Button className="bg-blue-500 text-white"  onClick={()=>dispatch(increment())}>inc</Button>
      <h1 className="text-center text-2xl font-bold mt-4">Counter: {counter}</h1>
      <Button className="bg-red-500 text-white"  onClick={()=>dispatch(decrement())}>dec</Button>
      {/* Slider — .slick-set { margin-top:80px; overflow:hidden !important; } */}
      <div className="mt-20 !overflow-hidden">
        {/* <Slider {...settings}>
          {slideProducts?.map((p) => (
            // .imgbox { height:21vh; width:100%; } + hover:cursor-pointer
            // responsive: max-760px -> 13vh, max-540px -> 9vh
            <div
              className="!h-[21vh] !w-full max-[760px]:!h-[13vh] max-[540px]:!h-[9vh] hover:cursor-pointer"
              key={p._id}
            >
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                // .card-img-top-slide { object-fit:fill; border-radius:50%; width:100%; height:100%; }
                className="h-full w-full rounded-full object-fill"
                alt={p.name}
                onClick={() => navigate(`/product/${p.slug}`)}
              />
            </div>
          ))}
        </Slider> */}
      </div>

      {/* Filter bar */}
      {/* <FilterBar
        categories={categories}
        prices={Prices}
        checked={checked}
        setChecked={setChecked}
        radio={radio}
        onCategory={handleFilter}
        onPrice={(val: number[]) => setRadio(val)}
        onReset={() => {
          setChecked([]);
          setRadio([]);
        }}
      /> */}

      {/* Products — .container-fluid { padding-right:0; } */}
      <div className="w-full mt-3 pr-0">
        <h1
          className="text-center mb-3 text-gray-500 [font-family:'Playfair_Display',_serif]"
        >
          All Products
        </h1>

        {/*
          .pg-grid {
            display:grid; grid-template-columns:repeat(5,1fr); gap:20px;
            width:100%; box-sizing:border-box; padding:16px 0;
          }
          @media(max-width:1200px) -> repeat(3,1fr)
          @media(max-width:760px)  -> repeat(2,1fr), gap:14px
          @media(max-width:540px)  -> 1fr, gap:10px
        */}
        <div className="grid w-full box-border py-4 px-0 gap-[20px] grid-cols-5 max-[1200px]:grid-cols-3 max-[760px]:grid-cols-2 max-[760px]:gap-[14px] max-[540px]:grid-cols-1 max-[540px]:gap-[10px]">
          {products?.map((p) => (
            <h1>product1</h1>
            // <ProductCard
            //   key={p._id}
            //   p={p}
            //   cart={cart}
            //   setCart={setCart}
            //   buy={buy}
            //   increaseQuantity={increaseQuantity}
            //   decreaseQuantity={decreaseQuantity}
            //   navigate={navigate}
            //   toast={toast}
            //   handleAdd={handleAdd}
            //   handleRemove={handleRemove}
            //   openCustomizationModal={openCustomizationModal}
            // />
          ))}
        </div>
        {showCustomizationModal && currentProduct && (
          <h1>p1</h1>
          // <CustomizeProductCard
          //   p={currentProduct}
          //   confirmCustomization={confirmCustomization}
          //   closeCustomizationModal={closeCustomizationModal}
          //   customization={customization}
          //   setCustomization={setCustomization}
          //   currentProduct={currentProduct}
          //   closeCustomizationDelete={closeCustomizationDelete}
          // />
        )}
        {showCustomizationDelete && (
          <h1>p1</h1>
          // <CustomizeDeleteProductCard
          //   productId={delProductId}
          //   closeCustomizationDelete={closeCustomizationDelete}
          // />
        )}
        {/* Load more */}
        <div className="m-2 p-3">
          {products && products.length < total && (
            <button
              // .loadmore { color:green; font-weight:bold; font-size:20px !important; }
              // "btn" (Bootstrap) approximated below since its CSS wasn't provided
              className="inline-block cursor-pointer select-none rounded border border-transparent px-3 py-1.5 text-center align-middle text-green-600 font-bold !text-xl"
              onClick={(e) => {
                e.preventDefault();
                setPage(page + 1);
              }}
            >
              {loading ? "Loading ..." : "Explore more .."}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;