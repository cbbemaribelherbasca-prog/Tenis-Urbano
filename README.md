# Tenis Urbano · H3

Shell React con componentes reutilizables y rutas para una tienda de calzado. Conserva el catálogo de nueve modelos e integra Inicio, Catálogo, Favoritos, Detalle de producto y Carrito.

Repositorio: [Tenis Urbano](https://github.com/cbbemaribelherbasca-prog/Tenis-Urbano).

## Componentes principales y sus responsabilidades

| Componente     | Responsabilidad                                                                                                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `App`          | Define las rutas de la aplicación. Permite abrir el detalle de un producto como modal sobre la vista actual y contempla las rutas inexistentes.                                               |
| `Layout`       | Organiza la estructura compartida: cabecera, navegación por categorías, menú móvil, contenido de cada ruta, beneficios y footer. Muestra los contadores de favoritos y carrito.               |
| `Hero`         | Presenta la portada de la colección, la imagen destacada y el enlace al catálogo. Se comparte entre Inicio y Catálogo.                                                                        |
| `Home`         | Compone la vista de inicio utilizando la portada y el catálogo.                                                                                                                               |
| `Catalog`      | Presenta la colección y gestiona la búsqueda, los filtros de público y estilo y el ordenamiento de productos.                                                                                 |
| `ProductCard`  | Muestra la imagen, el nombre, el precio y los datos de un producto. Permite abrir el modal y agregar o quitar favoritos. Se utiliza en Catálogo y Favoritos.                                  |
| `Modal`        | Contenedor reutilizable del diálogo: apertura, portal, fondo inerte y oscuro, cierre, ciclo de foco y recuperación del foco y desplazamiento al regresar.                                     |
| `Product`      | Presenta el modal de detalle con imagen, descripción, precio y tallas. Muestra la talla seleccionada debajo de la imagen, permite agregar al carrito y conserva la vista de origen al cerrar. |
| `Favorites`    | Muestra los productos guardados mediante las mismas tarjetas del catálogo y presenta un estado vacío cuando no hay favoritos.                                                                 |
| `Cart`         | Presenta los productos seleccionados con sus tallas, permite cambiar cantidades o eliminar artículos y calcula el importe total.                                                              |
| `ShopProvider` | Centraliza el estado de favoritos y carrito y las operaciones para modificarlos. Conserva la selección en `localStorage` y tolera datos almacenados inválidos o almacenamiento no disponible. |
| `Dropdown`     | Proporciona un selector reutilizable con panel de opciones, selección visible, navegación por teclado y cierre con Escape o clic exterior. Se utiliza para ordenar el catálogo.               |
| `Benefits`     | Presenta los tres beneficios antes del footer: Envíos nacionales, Compra protegida y Cambios fáciles. Se comparte entre todas las vistas.                                                     |
| `EmptyState`   | Presenta mensajes para listas vacías, productos inexistentes o rutas no encontradas y ofrece un enlace al catálogo.                                                                           |
| `Icon`         | Centraliza los iconos de búsqueda, favoritos y carrito para mantener una apariencia consistente.                                                                                              |

## Organización y reutilización

El código se organiza por responsabilidad:

| Carpeta           | Contenido                                                            |
| ----------------- | -------------------------------------------------------------------- |
| `src/components/` | Elementos compartidos de presentación y navegación.                  |
| `src/pages/`      | Vistas asociadas a las rutas.                                        |
| `src/context/`    | Estado compartido de la tienda y operaciones de favoritos y carrito. |
| `src/data/`       | Catálogo de productos, imágenes y formato de moneda.                 |

`src/main.jsx` monta React, el router, el proveedor de estado y los estilos. `src/App.jsx` establece la relación entre las rutas y las vistas.

**Decisión de reutilización:** Catálogo y Favoritos comparten `ProductCard` y consultan el mismo estado de `ShopProvider`. Así, las tarjetas mantienen el mismo diseño y comportamiento, y un cambio de favorito se refleja en las vistas y en el contador sin duplicar lógica. De la misma forma, `Layout` reúne la navegación, los beneficios y el footer para mantenerlos consistentes en toda la aplicación.

## Rutas y evidencia visual

| Vista               | Ruta              | Evidencia                                         |
| ------------------- | ----------------- | ------------------------------------------------- |
| Inicio              | `/#/`             | [Portada](docs/01-inicio.png)                     |
| Catálogo            | `/#/catalogo`     | [Colección y filtros](docs/02-catalogo.png)       |
| Favoritos           | `/#/favoritos`    | [Productos guardados](docs/03-favoritos.png)      |
| Detalle de producto | `/#/producto/:id` | [Modal y talla seleccionada](docs/04-detalle.png) |
| Carrito             | `/#/carrito`      | [Selección y total](docs/05-carrito.png)          |

Las categorías Todos, Hombre, Mujer, Niños y Ofertas enlazan al catálogo y reflejan el filtro en la URL. El detalle mantiene una ruta propia y se presenta sobre la vista desde la que se abrió.

[Vista móvil](docs/06-movil.png) · [Modal móvil](docs/07-modal-movil.png) · [Desplegable de ordenamiento](docs/08-dropdown.png)

## Presentación y validación

La interfaz utiliza las fuentes DM Sans y Space Grotesk incluidas localmente. La portada, las tarjetas, el modal y el selector se adaptan a pantallas de escritorio y móviles.

La compilación de producción fue verificada y las siete pruebas automatizadas aprobaron. Cubren navegación, filtros, favoritos, selección de talla, carrito persistente, cierre del modal, ordenamiento, uso por teclado y adaptación móvil.

El proyecto es una demostración de interfaz y no procesa pagos ni se conecta a un backend.

## Refactor y evidencia

La lógica del diálogo se separó de Product en el componente reutilizable Modal. La página conserva las decisiones de navegación y compra, mientras el contenedor centraliza el cierre y la accesibilidad. [Decisión, evidencia visual y verificación](docs/REFACTOR-MODAL.md).

El carrito incluye un botón Finalizar compra, negro y rojo al pasar el cursor, que abre una confirmación de compra de demostración. El botón Volver al catálogo de esa confirmación vacía el carrito y regresa a la colección; el carrito permanece vacío tras recargar. Product y Cart reutilizan el mismo componente Modal. [Evidencia de compra exitosa](docs/10-compra-exitosa.png).
