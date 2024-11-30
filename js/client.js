
let token = window.localStorage.getItem("token");
if (!token) {
    console.error("Token not found");
    location.pathname="/index.html"
}
const elTemp = document.querySelector(".js-temp").content;
const elTempOrders = document.querySelector(".js-templete").content;
const elProductList = document.querySelector(".js-products-list");
const eltotal = document.querySelector(".total");

const elSortSelect = document.querySelector(".js-sort-select");
let bookmarked = JSON.parse(localStorage.getItem("bookmark")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
localStorage.setItem("bookmark", JSON.stringify(bookmarked));
console.log(orders);

function isNumber(value) {
    return !isNaN(value);
}

const sortProducts = {
    ["a-z"]: (a, b) => a.product_name.localeCompare(b.product_name,"eng"),
    ["z-a"]: (a, b) => b.product_name.localeCompare(a.product_name),
    ["lot-few"]: (a, b) => b.product_price - a.product_price,
    ["few-lot"]: (a, b) => a.product_price - b.product_price
};

async function getProducts() {
    try {
        const req = await fetch("http://localhost:5000/product", {
            method: "GET",
            headers: { authorization: token },
        });
        if (!req.ok) {
            console.error(`Error: ${req.status} - ${req.statusText}`);
            return;
        }
        products = await req.json();
        localStorage.setItem("products", JSON.stringify(products));
    } catch (err) {
        console.error("Error fetching products:", err);
    } finally {
        handleRenderProducts(products, bookmarked, elProductList);
    }
}

function handleRenderProducts(products, bookmark = [], position,regName="(?:)", filterValue="") {
    position.innerHTML = "";
    const docFragment = document.createDocumentFragment();

   


    products.forEach((element) => {
        const clone = elTemp.cloneNode(true);

        clone.querySelector(".js-img").src = `http://localhost:5000/${element.product_img}`;
        clone.querySelector(".js-title").textContent = element.product_name;
        clone.querySelector(".js-price").textContent = `$${element.product_price}`;
        clone.querySelector(".js-desc").textContent = `${element.product_desc.slice(0,40)}`;
        clone.querySelector(".js-bookmark").dataset.id = element.id;
        clone.querySelector(".js-add").dataset.id = element.id;
        
        if (regName && regName.source != "(?:)"&&isNumber(filterValue)) {
            
            
            clone.querySelector(".js-price").innerHTML=element.product_price.replace(regName,(match)=>{
                return `<mark>${match}</mark>`
            })
            
        } else {
             clone.querySelector(".js-price").textContent = `$${element.product_price}`;
           }
         if (regName && regName.source != "(?:)"&&!isNumber(filterValue)) {
             
             
            clone.querySelector(".js-title").innerHTML=element.product_name.replace(regName,(match)=>{
                 return `<mark>${match}</mark>`
                })
                
            } else {
             clone.querySelector(".js-title").textContent = element.product_name;
             }

        clone.querySelector(".js-add").addEventListener("click", (evt) => {
            addOrder(evt.target.dataset.id);
        });


        clone.querySelector(".js-bookmark").addEventListener("click", (evt) => {
            const hasInBookmark = bookmark?.some((item) => item.id == evt.target.dataset.id);
            if (hasInBookmark) {
                bookmark = bookmark.filter((item) => item.id != evt.target.dataset.id);
                localStorage.setItem("bookmark", JSON.stringify(bookmark));
                if (!bookmark || bookmark.length === 0) {
                    bookmarkList.innerHTML = "<li class='text-gray-500 text-center'>No bookmarks yet</li>";
                    return;
                }
                
                handleRenderProducts(bookmark,JSON.parse(localStorage.getItem("bookmark")),bookmarkList)
                
            } else {
                const product = products.find((item) => item.id == evt.target.dataset.id);
                if (product) bookmark.push(product);
                handleRenderBookmarks(JSON.parse(localStorage.getItem("bookmark")));
                localStorage.setItem("bookmark", JSON.stringify(bookmark));
            }
            
            handleRenderProducts(products, JSON.parse(localStorage.getItem("bookmark")), position);
        });
        document.querySelector(".js-bookmark-count").textContent=JSON.parse(localStorage.getItem("bookmark")).length
        console.log(JSON.parse(localStorage.getItem("bookmark")).length);

        if ( bookmark?.some((item) => item.id == element.id)) {
            clone.querySelector(".js-bookmark").src="./assets/img/image copy.png"
        }

        docFragment.append(clone);
    });

    position.append(docFragment);
}

function filter() {
    let filterValue=document.querySelector(".js-filter-input").value.trim();
    let filteredProducts=[];
    let regName= new RegExp(filterValue,"gi");
     filteredProducts=products.filter(product =>
            (isNumber(filterValue)==true?(filterValue==""||product.product_price.toLocaleString().match(regName)):
            (filterValue === "" || product.product_name.toLowerCase().match(regName)))
    ).sort(
        sortProducts[elSortSelect.value]
    )
    console.log(filteredProducts);
    
    handleRenderProducts(filteredProducts,bookmarked,elProductList,regName,filterValue)

} 
const modal = document.querySelector(".js-modal");
const bookmarkList = document.querySelector(".js-bookmark-list");
const openModalButton = document.querySelector(".js-bookmark-btn");
const modalOrder = document.querySelector(".js-order-modal");
const orderList = document.querySelector(".js-order-list");
const openOrderButton = document.querySelector(".js-order-btn");

function handleRenderBookmarks(bookmark) {
    bookmarkList.innerHTML = "";
    if (!bookmark || bookmark.length === 0) {
        bookmarkList.innerHTML = "<li class='text-gray-500 text-center'>No bookmarks yet</li>";
        return;
    }
    handleRenderProducts(JSON.parse(localStorage.getItem("bookmark")),JSON.parse(localStorage.getItem("bookmark")),bookmarkList)
}
function openModal(pos) {
    pos.classList.remove("hidden");
    handleRenderBookmarks(bookmarked);
}

function closeModal() {
    modal.classList.add("hidden");
    modalOrder.classList.add("hidden");
    filter()
    // handleRenderProducts(JSON.parse(localStorage.getItem("products")), JSON.parse(localStorage.getItem("bookmark")) ,elProductList)
}

document.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape") {
        closeModal();
    }
});

openModalButton.addEventListener("click", (evt)=>{
    openModal(modal)
});
openOrderButton.addEventListener("click", (evt)=>{
    openModal(modalOrder)
    handleRenderOrders(products,orders,orderList)
});


function handleRenderOrders(products, orders, position) {
    position.innerHTML = "";
    const docFragment = document.createDocumentFragment();
    let total=0;
    orders.forEach((item) => {
        let element = products.find((e) => e.id == item.product_id);
        if (!element) return;

        const clone = elTempOrders.cloneNode(true);

        clone.querySelector(".js-img").src = `http://localhost:5000/${element.product_img}`;
        clone.querySelector(".js-title").textContent = element.product_name;
        clone.querySelector(".js-price").textContent = `$${element.product_price}`;
        clone.querySelector(".js-bookmark").dataset.id = item.order_id;
        clone.querySelector(".js-bookmark").id = item.product_id;
        total+=Number(element.product_price)
        
        clone.querySelector(".js-bookmark").addEventListener("click", async(evt)=>{
            // console.log(evt.target.dataset.id);
            let req= await fetch(`http://localhost:5000/order/${evt.target.dataset.id}`,{
                method:"DELETE",
                headers:{
                    authorization:token,
                },
                body:JSON.stringify({
                    product_id:evt.target.id
                })
            })
            let res=await req.json()
            console.log(res);
            if (res=="deleted") {
                getOrders()
            }
            
        })
        

        docFragment.append(clone);
    });
    console.log(total);
    eltotal.textContent=`total price $${total}`
    document.querySelector(".js-order-count").textContent=JSON.parse(localStorage.getItem("orders")).length
        
    position.append(docFragment);
}


async function addOrder(id) {
    try {
        let req = await fetch(`http://localhost:5000/order`, {
            method: "POST",
            headers: {
                authorization: token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ product_id: id }),
        });
        let res = await req.json();
        console.log("Order added:", res);

        // Yangi buyurtmani qo'shish va render qilish
        if(req.ok){
            console.log(1);
            
            orders.push(res);
          
            localStorage.setItem("orders", JSON.stringify(orders));
        }
        let updatedOrders = await getOrders();
        console.log(updatedOrders);
        
        handleRenderOrders(products,updatedOrders,bookmarkList)
    } catch (err) {
        console.error("Error adding order:", err);
    }
}

async function getOrders() {
    try {
        let req = await fetch("http://localhost:5000/order", {
            method: "GET",
            headers: { authorization: token },
        });
        let res = await req.json();
        console.log(res);
       
       orders=res
        
        localStorage.setItem("orders", JSON.stringify(orders));
        handleRenderOrders(products,JSON.parse(localStorage.getItem("orders")),orderList)
        return orders; 
    } catch (err) {
        console.error("Error fetching orders:", err);
    }
}
getProducts();
getOrders();

let form=document.querySelector(".js-form")
form.addEventListener("submit",(evt)=>{
    evt.preventDefault();
    filter()
    // handleRenderProducts(products,bookmarked,elProductList,regName, filterValue)
    
})
