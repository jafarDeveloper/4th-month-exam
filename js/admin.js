let token = window.localStorage.getItem("token");
if (!token) {
    console.error("Token not found");
    location.pathname = "/index.html";
}

const elTemp = document.querySelector(".js-temp")?.content;
const elProductList = document.querySelector(".js-products-list");
const elProductBtn = document.querySelector(".js-product-btn");
const elModal = document.querySelector(".js-change-modal");

if (!elTemp || !elProductList || !elModal) {
    console.error("Required DOM elements not found!");
    throw new Error("Initialization failed.");
}

let products = JSON.parse(localStorage.getItem("products")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
console.log(orders);

// Products API fetch function
async function getProducts() {
    try {
        const req = await fetch("http://localhost:5000/product", {
            method: "GET",
            headers: { authorization: token },
        });

        if (!req.ok) {
            throw new Error(`Failed to fetch products: ${req.statusText}`);
        }

        products = await req.json();
        localStorage.setItem("products", JSON.stringify(products));
    } catch (err) {
        console.error("Error fetching products:", err);
        alert("Could not fetch products. Please try again later.");
    } finally {
        handleRenderProducts(products, elProductList);
    }
}

// Function to render products
function handleRenderProducts(products, position) {
    position.innerHTML = ""; // Clear previous products
    const docFragment = document.createDocumentFragment();

    products.forEach((product) => {
        const clone = elTemp.cloneNode(true);

        clone.querySelector(".js-img").src = `http://localhost:5000/${product.product_img}`;
        clone.querySelector(".js-title").textContent = product.product_name;
        clone.querySelector(".js-price").textContent = `$${product.product_price}`;
        clone.querySelector(".js-desc").textContent = `${product.product_desc}`;
        clone.querySelector(".js-delete").dataset.id = product.id;
        clone.querySelector(".js-add").dataset.id = product.id;

        clone.querySelector(".js-delete").addEventListener("click", (evt) => handleDeleteProduct(evt.target.dataset.id));
        clone.querySelector(".js-add").addEventListener("click", (evt) => openModalForEdit(evt.target.dataset.id));

        docFragment.append(clone);
    });

    position.append(docFragment);
}

// Delete product function
async function handleDeleteProduct(productId) {
    try {
        const req = await fetch(`http://localhost:5000/product/${productId}`, {
            method: "DELETE",
            headers: { authorization: token },
        });
        const res = await req.json();

        console.log(res);
        if (!req.ok) {
            throw new Error(`Failed to delete product: ${req.statusText}`);
        }

        getProducts(); // Refresh products after deletion
    } catch (err) {
        console.error("Error deleting product:", err);
        alert("Could not delete the product. Please try again later.");
    }
}

// Open modal for editing
function openModalForEdit(product) {
    product= products.find((e)=>{ return e.id==product})
    elModal.classList.remove("hidden");

    // Mahsulot ma'lumotlarini forma ichiga yuklash
    elModal.querySelector(".js-title").value = product.product_name;
    elModal.querySelector(".js-desc").value = product.product_desc || "";
    elModal.querySelector(".js-price").value = product.product_price;
    elModal.querySelector(".js-img").value = ""; // Rasmlar bo'shatiladi
    
    // Saqlash tugmasini boshqarish
    const handleSave = async () => {
        elModal.classList.remove("hidden")
            elModal.querySelector(".js-change").addEventListener("click", async (e) => {
                console.dir(elModal.querySelector(".js-img").files[0], elModal.querySelector(".js-desc").value);
                let formData = new FormData();
                formData.set("product_name", elModal.querySelector(".js-title").value)
                formData.set("product_desc", elModal.querySelector(".js-desc").value)
                formData.set("product_img", elModal.querySelector(".js-img").files[0])
                formData.set("product_price", elModal.querySelector(".js-price").value)
                let req = await fetch(`http://localhost:5000/product/${product.id}`, {
                    method: "PUT",
                    headers: {
                        authorization: token
                    },
                    body: formData
                })
                let res = await req.json();
                   if (res=="updated") {
                    closeModal()
                   }
                getProducts()
            })
    };
    
    // Saqlash tugmasi uchun hodisani ulang
    elModal.querySelector(".js-change").onclick = handleSave;

    
}

// Close modal and reset values
function closeModal() {
    elModal.classList.add("hidden");
    elModal.querySelector(".js-title").value = "";
    elModal.querySelector(".js-desc").value = "";
    elModal.querySelector(".js-img").value = "";
    elModal.querySelector(".js-price").value = "";
}

// Close modal on Escape key
document.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape") {
        closeModal();
    }
});
 
elProductBtn.addEventListener("click",(evt)=>{
    elModal.classList.remove("hidden");
    elModal.querySelector(".js-change").textContent="add"
    elModal.querySelector(".js-change").addEventListener("click", async(evt)=>{

        const formData = new FormData();
        formData.set("product_name", elModal.querySelector(".js-title").value);
        formData.set("product_desc", elModal.querySelector(".js-desc").value);
        formData.set("product_img", elModal.querySelector(".js-img").files[0]);
        formData.set("product_price", elModal.querySelector(".js-price").value);
    
        const req = await fetch(`http://localhost:5000/product/`, {
            method: "POST",
            headers: { authorization: token },
            body: formData,
        });
    
        const res = await req.json();
        
        if (!req.ok) {
            throw new Error(`Failed to update product: ${req.statusText}`);
        }
    
        console.log(res);
        closeModal();
        getProducts(); // Refresh products
    })
})
// Initialize product fetching
getProducts();
