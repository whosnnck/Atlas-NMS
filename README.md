# ATLAS · No Man's Sky Universe Companion

Aplicación web responsive para gestionar una bitácora personal de No Man's Sky, con React, Vite y Supabase Auth/Database.

## Funciones incluidas
- Registro e inicio de sesión por correo y contraseña.
- Datos aislados por usuario mediante Row Level Security (RLS).
- Formularios especializados para sistemas, planetas y lunas, bases, asentamientos, cargueros, fragatas, corbetas, naves, exonaves, tripulación, flora, fauna, inventario, recursos, objetivos, misiones, expediciones, tecnologías y puntos de interés.
- Selectores de relaciones entre registros para reutilizar sistemas, planetas, bases, cargueros, fragatas, recursos y naves.
- Búsqueda y tarjetas que se abren al hacer clic en cualquier parte, conservando los botones «Ver / editar» y eliminar.
- Exportación e importación JSON de registros compartibles. Los registros personales (bases, asentamientos, flota, tripulación, naves, inventario, misiones y expediciones) no se exportan. También se excluyen campos personales como bases asociadas, estado de visita y cantidades de recursos.
- Suma de cantidades al añadir inventario para un recurso ya existente.
- Estado de posesión de naves; las vendidas se eliminan al volver a cargar Atlas una vez transcurridos siete días.
- Diseño adaptable a móvil y escritorio.

## Requisitos
- Node.js 20 o superior.
- Proyecto Supabase.

## Supabase
1. En Supabase → SQL Editor, ejecuta `supabase-schema.sql`.
2. En Project Settings → API, copia Project URL y la clave pública `anon` o `publishable`.
3. Copia `.env.example` a `.env.local` y configura:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. No uses `service_role` ni claves secretas en el navegador.

## Ejecutar localmente
```bash
npm install
npm run dev
```

## Exportar e importar una bitácora
Desde cualquier módulo, usa **Exportar JSON** para descargar descubrimientos compartibles o **Importar JSON** para incorporar el archivo de otro jugador. Atlas valida el formato, omite categorías personales y evita duplicar registros con el mismo nombre y categoría. Revisa la bitácora después de importar para confirmar que las relaciones se resolvieron correctamente.

## Consideraciones
- Los registros se guardan en `public.nms_records` como categoría, nombre y JSONB. Esta versión mantiene el esquema existente y no requiere migración de base de datos.
- Las relaciones nuevas guardan identificadores de los registros relacionados. Los registros antiguos basados en texto siguen siendo legibles, pero no se convierten automáticamente en relaciones.
- Las imágenes de recursos se registran mediante una URL accesible; la subida directa de archivos a Supabase Storage queda para una fase posterior.
- La limpieza de naves vendidas se ejecuta cuando Atlas carga los registros; para eliminar registros incluso cuando nadie abre la aplicación, se necesitaría una tarea programada en el servidor.
- La aplicación no se conecta automáticamente con los datos guardados dentro de No Man's Sky.
