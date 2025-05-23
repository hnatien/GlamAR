$(document).ready(function () {
  initializeCart();
  async function updateCartCount() {
    try {
      const token = localStorage.getItem("token");
      const userId = token ? "user" : "guest";
      const url = token ? "/api/cart/count" : `/api/cart/count/${userId}`;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(url, { headers });
      const data = await response.json();
      const count = data.count || 0;
      $(".cart-icon-wrapper #cart-count").text(count);
      localStorage.setItem("cartCount", count);
    } catch (error) {
      console.error("Error updating cart count:", error);
      $(".cart-icon-wrapper #cart-count").text("0");
    }
  }

  // Khởi tạo số lượng từ localStorage
  const savedCount = localStorage.getItem("cartCount");
  if (savedCount !== null) {
    $(".cart-icon-wrapper #cart-count").text(savedCount);
  } else {
    updateCartCount();
  }

  // Cập nhật khi trang được tải hoặc quay lại
  window.addEventListener("pageshow", function (event) {
    if (event.persisted || performance.navigation.type === 2) {
      updateCartCount();
    }
  });

  // Cập nhật realtime từ các tab khác
  window.addEventListener("storage", function (event) {
    if (event.key === "cartUpdated") {
      updateCartCount();
    }
  });

  function sortProducts(sortValue) {
    const $container = $("#products-container");
    const $products = $(".product-card").detach(); // Tách sản phẩm khỏi DOM tạm thời

    $products.sort(function (a, b) {
      const aName = $(a).data("name").toLowerCase();
      const bName = $(b).data("name").toLowerCase();

      // Xử lý giá tiền - loại bỏ dấu phẩy và ký tự không phải số
      const aPrice = parseFloat(
        $(a)
          .data("price")
          .replace(/[^0-9.]/g, "")
      );
      const bPrice = parseFloat(
        $(b)
          .data("price")
          .replace(/[^0-9.]/g, "")
      );

      switch (sortValue) {
        case "name-asc":
          return aName.localeCompare(bName);
        case "name-desc":
          return bName.localeCompare(aName);
        case "price-asc":
          return aPrice - bPrice;
        case "price-desc":
          return bPrice - aPrice;
        default:
          return $(a).data("original-index") - $(b).data("original-index");
      }
    });

    // Thêm lại sản phẩm đã sắp xếp
    $container.append($products);
  }

  // Lưu chỉ số ban đầu của sản phẩm
  $(".product-card").each(function (index) {
    $(this).data("original-index", index);
  });

  // Xử lý sự kiện change
  $("#sort-by").on("change", function () {
    sortProducts($(this).val());
  });

  // Sắp xếp mặc định khi trang load
  sortProducts($("#sort-by").val());

  // Cập nhật giỏ hàng khi trang được tải
  updateCartCount();

  // Cập nhật khi quay lại từ cache
  window.addEventListener("pageshow", function (event) {
    if (event.persisted || performance.navigation.type === 2) {
      updateCartCount();
    }
  });

  // Cập nhật realtime giữa các tab
  window.addEventListener("storage", function (event) {
    if (event.key === "cartUpdated") {
      initializeCart();
    }
  });
});

function startCartPolling() {
  setInterval(async () => {
    try {
      const response = await fetch("/api/cart/count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      $("#cart-count").text(data.count || 0);
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
    }
  }, 2000);
}

if (new URLSearchParams(window.location.search).has("forceRefresh")) {
  localStorage.removeItem("cartCache");
  syncCart();
}

// Khởi động khi trang load
if (performance.navigation.type === 1 || performance.navigation.type === 2) {
  initializeCart();
}
// async function updateCartCount() {
//   try {
//     const token = localStorage.getItem("token");
//     const userId = token ? "user" : "guest";
//     const url = token ? "/api/cart/count" : `/api/cart/count/${userId}`;
//     const headers = token ? { Authorization: `Bearer ${token}` } : {};

//     const response = await fetch(url, { headers });
//     if (!response.ok) throw new Error("Failed to load cart count");

//     const data = await response.json();
//     $(".cart-icon-wrapper #cart-count").text(data.count || 0);

//     // Thông báo cập nhật cho các tab khác
//     localStorage.setItem("cartUpdated", Date.now().toString());
//   } catch (error) {
//     console.error("Lỗi khi cập nhật giỏ hàng:", error);
//     $(".cart-icon-wrapper #cart-count").text("0");
//   }
// }

// $(document).ready(function () {
//   updateCartCount();
// });
