document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cart-container");

    function renderCart(cartData) {
        cartContainer.innerHTML = "";

        if (cartData.carts.length) {
            const cartList = document.createElement("ul");

            cartData.carts.forEach(cart => {
                const cartItem = document.createElement("li");
                cartItem.innerHTML = `<p>Cart ID: ${cart._id}</p><p>Products:</p>`;

                const productList = document.createElement("ul");

                cart.products.forEach(product => {
                    const productItem = document.createElement("li");
                    productItem.textContent = `${product.product} - Quantity: ${product.quantity}`;
                    productList.appendChild(productItem);
                });

                cartItem.appendChild(productList);
                cartList.appendChild(cartItem);
            });

            cartContainer.appendChild(cartList);
        } else {
            cartContainer.innerHTML = "<p>No carts available.</p>";
        }

        if (cartData.pagination) {
            const paginationInfo = document.createElement("p");
            paginationInfo.textContent = `Page ${cartData.pagination.current} of ${cartData.pagination.total}`;

            cartContainer.appendChild(paginationInfo);

            if (cartData.pagination.prev) {
                const prevLink = document.createElement("a");
                prevLink.href = `?page=${cartData.pagination.prev}`;
                prevLink.textContent = "Previous";
                cartContainer.appendChild(prevLink);
            }

            if (cartData.pagination.next) {
                const nextLink = document.createElement("a");
                nextLink.href = `?page=${cartData.pagination.next}`;
                nextLink.textContent = "Next";
                cartContainer.appendChild(nextLink);
            }
        }
    }

    function fetchCartData(page = 1) {
        fetch(`/carts?page=${page}`)
            .then(response => response.json())
            .then(data => {
                renderCart(data);
            })
            .catch(error => console.error("Error fetching cart data:", error));
    }

    fetchCartData();
});
