---
name: captcha_implementation_decisions
description: Key implementation decisions made during CAPTCHA system development
type: project
originSessionId: 7df5834d-1e10-4148-b8d8-d46ab87be21e
---
# CAPTCHA System - Implementation Decisions

Decisiones importantes tomadas durante el desarrollo del sistema de CAPTCHA.

## Database vs Filesystem

**Decisión**: Usar filesystem en lugar de base de datos para el sistema de aprendizaje.

**Contexto**: Inicialmente se propuso usar Ecto con una tabla `captcha_learning`, incluso se creó una migración.

**Why cambió**: Usuario prefirió sistema basado en archivos por simplicidad y portabilidad.

**Implementación final**:
- Archivos nombrados: `UUID_SOLUCION.jpg` para aciertos
- `UUID.jpg` para fallos
- Metadata opcional en `.json`
- Sin dependencia de DB

**Archivo eliminado**: `priv/repo/migrations/20260614000001_create_captcha_learning.exs`

**Beneficios**:
- Portátil (copiar directorio = copiar datos)
- Inspección visual fácil
- Git-friendly para ejemplos de test
- No requiere migraciones

**Trade-offs**:
- Queries complejas más difíciles
- Sin relaciones DB
- Búsqueda menos eficiente

## Organization by Tracker

**Decisión**: Organizar datasets por tracker/dominio, no mezclados.

**Contexto**: Primera implementación guardaba todo mezclado en `priv/ml/captcha_learning/{success,failed}`.

**Why cambió**: Usuario se dio cuenta que cada tracker tiene sus propios CAPTCHAs únicos.

**Implementación final**:
```
priv/ml/captcha_learning/
  tracker1.com/
    success/
    failed/
    classified/
  tracker2.org/
    ...
```

**Beneficios**:
- Modelos específicos por tracker (mejor accuracy)
- Análisis por tracker
- Ver qué trackers tienen más problemas
- Training data limpio por dominio

**Implicación**: Todas las funciones de FileStorage aceptan parámetro `tracker` opcional.

## Behaviour-Based Architecture

**Decisión**: Usar `@behaviour` para solvers en lugar de case statement simple.

**Why**: Cumplir con principios SOLID (guardado en memoria del usuario).

**Implementación**:
- `Tailorr.Captcha.Solver` - Behaviour con `@callback solve/2`
- Cada backend implementa el behaviour
- Módulo principal hace dispatch via map `@backends`

**Beneficios**:
- Open/Closed Principle
- Fácil agregar nuevos backends
- Type checking en compile time
- Documentación clara del contrato

## Smart Solver Cascade Strategy

**Decisión**: Implementar estrategia en cascada ML → Usuario.

**Why**: 
- ML es rápido pero puede fallar
- Usuario es lento pero preciso
- Queremos aprender de ambos

**Implementación**:
1. Intenta ML primero
2. Si confianza < 90% → pregunta a usuario
3. Compara ML vs Usuario
4. Guarda resultado y feedback

**Beneficios**:
- Mejora continua del modelo ML
- Fallback confiable
- Datos etiquetados automáticamente
- Usuario solo interviene cuando necesario

## Python Training Script (Opcional)

**Decisión**: Incluir script Python para training además de implementación Elixir.

**Contexto**: Usuario cuestionó uso de Python en proyecto Elixir.

**Resolución**: Implementar ambos:
- `Tailorr.ML.CaptchaTrainer` - Elixir con Nx/Axon (recomendado)
- `priv/ml/train_captcha_model.py` - Python con PyTorch (opcional)

**Why ambos**:
- Elixir: Integración nativa, mismo stack
- Python: Ecosistema ML más maduro, más modelos disponibles

**Recomendación**: Usar Elixir a menos que se necesite modelo específico solo en Python.

## Test Coverage Requirements

**Decisión**: Tests obligatorios para todo código nuevo.

**Why**: Guardado en memoria del usuario como feedback.

**Implementación**:
- 70+ tests para FileStorage
- Tests para cada backend
- Tests de integración marcados con `@tag :skip`
- Cobertura ~80-90% del código core

**Convención**:
```elixir
# Tests que requieren setup externo
@tag :skip
test "integration with real service"

# Tests rápidos, siempre corren
test "unit test"
```

## LiveView sin Dependencias Externas

**Decisión**: LiveView lee directamente del filesystem, no usa DB.

**Implementación**:
- `FileStorage.list_failed()` etc
- No Ecto queries
- Archivos servidos por Phoenix static

**Beneficios**:
- Consistencia con sistema de archivos
- No duplicar datos
- UI refleja filesystem 1:1

## Tracker Auto-Detection

**Decisión**: Extraer tracker automáticamente de URL de imagen.

**Implementación**:
```elixir
defp get_tracker(captcha_data) do
  cond do
    Map.has_key?(captcha_data, :tracker) -> captcha_data.tracker
    Map.get(captcha_data, :image_type) == :url -> extract_domain(url)
    true -> "unknown"
  end
end
```

**Beneficios**:
- Menos código boilerplate
- Funciona sin modificar código de trackers
- Fallback a "unknown" si no se puede determinar

## Metadata in Sidecar JSON Files

**Decisión**: Metadata en archivos `.json` junto a imágenes, no en DB o nombres de archivo.

**Why**:
- Nombres de archivo: solo solución (crítico)
- Metadata adicional: JSON sidecar
- Sin límite de tamaño/complejidad

**Ejemplo**:
```
abc123_SOLUTION.jpg      # Imagen
abc123_SOLUTION.json     # Metadata
```

**Contenido JSON**:
```json
{
  "solver": "ml",
  "confidence": 0.95,
  "tracker": "example.com",
  "timestamp": "2026-06-14T..."
}
```

## How to Apply

Para futuras sesiones:

1. **Nuevos backends**: Implementar `@behaviour Tailorr.Captcha.Solver`
2. **Guardar datos**: Siempre usar `FileStorage.save_*` con tracker
3. **Tests**: Crear antes o junto con implementación
4. **Organización**: Por tracker, no mezclado
5. **Filesystem**: Preferir sobre DB para este sistema
