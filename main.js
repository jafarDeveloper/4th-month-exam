btn.addEventListener("click", () => {
    console.dir(file.files[0])
    console.log(date.value)
    let formData = new FormData()
    // formData.append("product_name", "Code");
    // formData.append("product_desc", "Code kahoot");
    // formData.append("product_img", file.files[0]);
    // formData.append("product_price", 40000);
    // fetch("http://localhost:5000/product", {
    //     method: "POST",
    //     headers: {
    //         authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwidXNlcl9uYW1lIjoiU2Fsb20iLCJwaG9uZSI6Ijk5MTQ1Nzc2NiIsImVtYWlsIjoic2Fsb20yQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYzQ4NzE3YzA1ODFmODhlNGI2ZWU3MWM3OWVjOGIyMTdiMzYyYTEyNDIxOTc3YWI4OGEwNjIzNWVkYWU5ZWQ4ZCIsImRhdGUiOiIyMDI0LTExLTI2VDA5OjM2OjU1Ljc5NFoiLCJpYXQiOjE3MzI2MjEwODN9.byXqQTQEqaVWxqqADZgSRcyPy5hNlpxfwmotLYvlnjk"
    //     },
    //     body: formData
    // }).then(res => res.json()).then(data => console.log(data))
    image.src = `http://localhost:5000/713dfeac-10c5-48cb-ad0a-f935dcce06f2.png`
})
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwidXNlcl9uYW1lIjoiU2Fsb20iLCJwaG9uZSI6Ijk5MTQ1Nzc2NiIsImVtYWlsIjoic2Fsb20yQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYzQ4NzE3YzA1ODFmODhlNGI2ZWU3MWM3OWVjOGIyMTdiMzYyYTEyNDIxOTc3YWI4OGEwNjIzNWVkYWU5ZWQ4ZCIsImRhdGUiOiIyMDI0LTExLTI2VDA5OjM2OjU1Ljc5NFoiLCJpYXQiOjE3MzI2MjEwODN9.byXqQTQEqaVWxqqADZgSRcyPy5hNlpxfwmotLYvlnjk"