# README - Gestor de Tareas

## Descripción

Este proyecto es una aplicación web para la gestión de tareas, desarrollada con Angular y Firebase. Permite a los usuarios autenticarse, crear, editar, completar y eliminar tareas de manera sencilla y eficiente. La interfaz es moderna y responsiva, pensada para mejorar la productividad diaria.

## Características

- **Autenticación:** Inicio de sesión con email y Firebase.
- **Gestión de tareas:** Crear, editar, completar, reabrir y eliminar tareas.
- **Notificaciones:** Mensajes visuales para informar sobre acciones y errores.
- **Filtros:** Visualiza tareas pendientes, completadas o todas.
- **Modal de confirmación:** Para acciones importantes como eliminar tareas.
- **Diseño responsivo:** Adaptado para dispositivos móviles y escritorio.

## Estructura del Proyecto

```
.editorconfig
.gitignore
angular.json
package.json
tsconfig.app.json
tsconfig.json
tsconfig.spec.json
.vscode/
public/
src/
  index.html
  main.ts
  styles.scss
  app/
    app.html
    app.ts
    config/
    features/
      iam/
      task/
    shared/
    environments/
    styles/
```

- **src/app/features/iam/**: Módulo de autenticación.
- **src/app/features/task/**: Módulo principal de tareas.
- **src/app/shared/**: Componentes y servicios reutilizables.
- **src/app/config/**: Configuración de rutas y Firebase.
- **src/environments/**: Variables de entorno para desarrollo y producción.
- **src/styles/**: Estilos globales y parciales SCSS.

## Instalación y ejecución

1. **Clona el repositorio:**
   ```sh
   git clone https://github.com/tu-usuario/app-task-ui.git
   cd app-task-ui
   ```

2. **Instala las dependencias:**
   ```sh
   npm install
   ```

3. **Levanta el servidor de desarrollo:**
   ```sh
   npm run start:dev
   ```
   La aplicación estará disponible en [http://localhost:4200](http://localhost:4200).

4. **Compila para producción:**
   ```sh
   npm run build
   ```

## Configuración de Firebase

Las credenciales de Firebase se encuentran en [`src/environments/environment.development.ts`](src/environments/environment.development.ts). Si deseas usar tu propio proyecto de Firebase, reemplaza los valores por los de tu consola de Firebase.

## Notas

- El proyecto utiliza Angular 20 y Firebase 12.
- El código está estructurado para facilitar la escalabilidad y el mantenimiento.
- Se recomienda usar VS Code y las extensiones sugeridas en `.vscode/extensions.json`.

## Autor

Desarrollado por Jonatan.

---

¡Gracias por usar el Gestor de Tareas! Si tienes dudas o sugerencias, no dudes en abrir un issue o contactarme.