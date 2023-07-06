const products = JSON.parse(`[
    { 
        "id": 1,
        "name": "Cif Ultrarápido Vidrios",
        "price": 750,
        "src": "../images/limpieza/cif-vidrios-dp-604cb82f201b6 repuesto.jpeg"
    },
    { 
        "id": 2,
        "name": "Magistral: Detergente para Vajillas",
        "price": 950,
        "src": "../images/limpieza/detergente-magistral-750cc-.jpg"
    },
  ]`);
  
  let carrito = [];
  
  function getStorageCarrito() {
    const cart2json = localStorage.getItem("carrito");
    return (cart2json == null)?([]):(JSON.parse(cart2json));
  }
  function setStorageCarrito() {
    const cart2string = JSON.stringify(carrito);
    localStorage.setItem("carrito", cart2string);
  }
  
  carrito = getStorageCarrito();
  
  if (carrito != []) {
    showCart();
  }
  
  function displayProducts() {
    const product_list = document.getElementById("product-list");
  
    products.forEach((product) => {
      const product_element = document.createElement("div");
      product_element.classList.add("product");
  
      const name_element = document.createElement("h3");
      name_element.textContent = product.name;
  
      const image_element = document.createElement("img");
      image_element.src = product.src;
      image_element.style.width = "200px";
      image_element.style.height = "200px";
  
      const price_element = document.createElement("p");
      price_element.textContent = "$" + product.price;
  
      const add_button = document.createElement("button");
      add_button.textContent = "Sumar al carrito";
      add_button.classList.add("add2Cart");
  
      product_element.appendChild(image_element);
      product_element.appendChild(name_element);
      product_element.appendChild(price_element);
      product_element.appendChild(add_button);
      product_list.appendChild(product_element);
    });
  }
  
  displayProducts();
  
  function add2Cart(e) {
    let hijo = e.target;
    let padre = hijo.parentNode;
  
    let nombre_producto = padre.querySelector("h3").textContent;
    let element = carrito.find((element) => element.nombre == nombre_producto);
    let found = element != undefined;
    let cantidad_producto = (!found)?(1):(element.cantidad+1);
  
    if (!found) {
      let precio_producto = parseInt(padre.querySelector("p").textContent.split("$")[1], 10);
      let img_producto = padre.querySelector("img").src;
      let producto = {
        nombre: nombre_producto,
        precio: precio_producto,
        img: img_producto,
        cantidad: cantidad_producto,
      };
      carrito.push(producto);
    } else {
      let index = carrito.indexOf(element);
      let product = carrito[index];
      let unit_price = product.precio/product.cantidad;
      carrito[index].precio += unit_price;
      carrito[index].cantidad = cantidad_producto;
    }
  
    setStorageCarrito();
    showCart();
  }
  
  function showCart() {
    let tabla = document.getElementById("tbody");
    tabla.innerHTML = "";
  
    for (let producto of carrito) {
      let fila = document.createElement("tr");
      fila.id = producto.nombre;
      fila.innerHTML = `<td><img src="${producto.img}"></td>
                            <td><p>${producto.nombre}</p></td>
                            <td>${producto.cantidad}</td>
                            <td>${producto.precio}</td>
                            <td><button class="btn btn-danger delFromCart">Borrar</button></td>`;
      tabla.append(fila);
    }
  
    let btn_borrar = document.querySelectorAll(".delFromCart");
  
    for (let btn of btn_borrar) {
      btn.addEventListener("click", delFromCart);
    }
  }
  
  function delFromCart(e) {
    let abuelo = e.target.parentNode.parentNode;
    let cells = abuelo.cells;
    let nombre_producto = abuelo.id;
    let product = carrito.find((product) => product.nombre == nombre_producto);
    let cantidad_producto = product.cantidad - 1;
  
    Swal.fire({
      title: '¿Quieres borrar este producto de tu carrito?',
      showCancelButton: true,
      confirmButtonText: 'Borrar',
      cancelButtonText: `No borrar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('¡Borrado!', '', 'success')
        let index = carrito.indexOf(product);
    if (cantidad_producto == 0) {
      abuelo.remove();
      carrito.splice(index, 1);
    } else {
      let unit_price = product.precio/product.cantidad;
      cells[2].innerHTML = cantidad_producto;
      carrito[index].precio -= unit_price;
      carrito[index].cantidad = cantidad_producto;
    }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  /*
    let index = carrito.indexOf(product);
    if (cantidad_producto == 0) {
      abuelo.remove();
      carrito.splice(index, 1);
    } else {
      let unit_price = product.precio/product.cantidad;
      cells[2].innerHTML = cantidad_producto;
      carrito[index].precio -= unit_price;
      carrito[index].cantidad = cantidad_producto;
    }
  
    setStorageCarrito();
    showCart(); */
  }
  
  let btn_compra = document.querySelectorAll(".add2Cart");
  
  for (let boton of btn_compra) {
    boton.addEventListener("click", add2Cart);
  }
  
  let btn_carrito = document.getElementById("showCart");
  
  btn_carrito.addEventListener("click", function () {
    let carrito = document.getElementById("carrito");
  
    if (carrito.style.display != "none") {
      carrito.style.display = "none";
    } else {
      carrito.style.display = "block";
    }
  });
  
  /*
  function geolocalizador() {
    const settings = {
      async: true,
      crossDomain: true,
      url: 'https://ip-geo-location.p.rapidapi.com/ip/check?format=json',
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b802290cb4mshce077a6b5aaeea4p1ce16ajsnd3676f808749',
        'X-RapidAPI-Host': 'ip-geo-location.p.rapidapi.com'
      }
    };
    
    console.log("settings: " + JSON.stringify(settings));
    $.ajax(settings).done(function (response) {
      console.log(response);
    });
  }
  */
  function mostrar_posicion( posicion ){
  
    let lat = posicion.coords.latitude;
    let long = posicion.coords.longitude;
    let key = "bbf8893c6e8030e157bb633d11a66e17";
  
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}&units=metric&lang=es`)
        .then( response => response.json() )
        .then( data =>{
                        document.body.innerHTML = `<p>${data.name}</p>
                                                   <p>Temp:${data.main.temp}</p>
                                                   <p>Clima:${data.weather[0].description}</p>`
        } )
  }
  navigator.geolocation.getCurrentPosition( mostrar_posicion );
  
  