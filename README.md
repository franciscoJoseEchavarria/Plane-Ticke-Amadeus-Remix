# Go4It - Amadeus

Un sistema web que permite a los usuarios recibir recomendaciones turísticas personalizadas en base a sus características demográficas y gustos personales.

## Características

- **Encuesta interactiva:** Los usuarios responden preguntas sobre sus preferencias.
- **Recomendaciones personalizadas:** Se sugieren dos destinos, uno en América y otro en Europa.
- **Formulario de acceso:** Se requiere ingresar nombre, correo y aceptar los términos y condiciones.

## 📝 Preguntas de la Encuesta

- ¿Qué tipo de entorno prefieres para tus vacaciones?
- ¿Qué clima prefieres durante tus vacaciones?
- ¿Qué tipo de actividades prefieres hacer durante tus vacaciones?
- ¿Qué tipo de alojamiento prefieres?
- ¿Cuánto tiempo planeas quedarte de vacaciones?
- ¿Cuál es tu rango de edad?

## 📚 Tecnologías Utilizadas

- RemixJS (Framework de React)
- TypeScript
- Git y GitHub
- Tailwind CSS para estilos

## 🛠️ Instalación y Ejecución

1. Clonar el repositorio del frontend:

   ```bash
   git clone https://github.com/cavalenciad/go4it-amadeus.git
   cd go4it-amadeus
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Ejecutar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Para su funcionamiento, se debe tener instalado y corriendo el backend:

   ```bash
   git clone https://github.com/cavalenciad/go4it_amadeus.git
   cd go4it_amadeus
   dotnet restore
   dotnet run
   ```

_(La base de datos está alojada en Amazon Web Services.)_

## 🌐 Estructura del Proyecto

```
/app 
  ├── components/   # Componentes reutilizables
  ├── interfaces/   # Interfaces para los datos 
  ├── routes/       # Vistas principales 
  ├── services/     # Llamadas a la API
  ├── root.tsx      # Punto de inicio de la app
  ├── tailwind.css  # Configuración de Tailwind para estilos
/public
  ├── citiesImg/    # Imágenes de ciudades
  ├── optionsImg/   # Imágenes opciones de respuesta
```

## 🔗 Enlaces Importantes

_(No hay demo
