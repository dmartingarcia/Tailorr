---
name: captcha_system_architecture
description: Complete CAPTCHA solving system with ML training capabilities organized by tracker
type: project
originSessionId: 7df5834d-1e10-4148-b8d8-d46ab87be21e
---
# CAPTCHA System Architecture

## Overview

Sistema completo de resolución de CAPTCHAs con 4 backends + aprendizaje automático, organizado por tracker/dominio.

## Backends Disponibles

### 1. Mock (`Tailorr.Captcha.Solvers.Mock`)
- **Propósito**: Testing
- **Retorna**: Solución configurable
- **Ubicación**: `lib/tailorr/captcha/solvers/mock.ex`
- **Tests**: `test/tailorr/captcha/solvers/mock_test.exs`

### 2. Manual (`Tailorr.Captcha` - legacy)
- **Propósito**: Input CLI del usuario
- **Retorna**: Lo que el usuario escribe
- **Ubicación**: `lib/tailorr/captcha.ex` (función privada)

### 3. OCR (`Tailorr.Captcha.Solvers.OCR`)
- **Propósito**: CAPTCHAs simples con Tesseract
- **Requiere**: `tesseract` instalado, opcionalmente `imagemagick`
- **Ubicación**: `lib/tailorr/captcha/solvers/ocr.ex`
- **Tests**: `test/tailorr/captcha/solvers/ocr_test.exs`

### 4. Telegram (`Tailorr.Captcha.Solvers.Telegram`)
- **Propósito**: Envía a canal Telegram, espera respuesta humana
- **Requiere**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- **Ubicación**: `lib/tailorr/captcha/solvers/telegram.ex`
- **Tests**: `test/tailorr/captcha/solvers/telegram_test.exs`

### 5. ML (`Tailorr.Captcha.Solvers.ML`)
- **Propósito**: Machine Learning con Nx/Axon/Bumblebee
- **Estado**: Estructura creada, requiere implementación de Bumblebee
- **Ubicación**: `lib/tailorr/captcha/solvers/ml.ex`

## Sistema de Aprendizaje Activo

### FileStorage (`Tailorr.Captcha.FileStorage`)

Sistema basado en archivos (sin DB) organizado por tracker/dominio.

**Estructura**:
```
priv/ml/captcha_learning/
  tracker1.com/
    success/
      abc123_ABC123.jpg     # UUID_SOLUCIÓN.jpg
    failed/
      def456.jpg            # UUID.jpg (sin solución)
    classified/
      distorted/
        ghi789_TEST.jpg     # Clasificados por categoría
  tracker2.org/
    success/
    failed/
    ...
```

**Funciones principales**:
- `save_success/4` - Guarda acierto con solución en nombre
- `save_failure/3` - Guarda fallo sin solución
- `classify/3` - Mueve de failed/ a classified/CATEGORY/
- `list_failed/1` - Lista fallos para revisar (opcionalmente por tracker)
- `export_training_data/1` - Genera labels.txt para entrenamiento
- `stats/1` - Estadísticas (globales o por tracker)

**Ubicación**: `lib/tailorr/captcha/file_storage.ex`
**Tests**: `test/tailorr/captcha/file_storage_test.exs` (70+ tests)

### SmartSolver (`Tailorr.Captcha.SmartSolver`)

Solver inteligente con estrategia en cascada:
1. Intenta ML primero (rápido)
2. Si confianza < 90% → pregunta a usuario (Telegram/Manual)
3. Guarda TODO automáticamente en FileStorage
4. Usuario corrige → Alta calidad para training

**Estrategias**:
- `:cascade` - ML → usuario si falla (default)
- `:ml_only` - Solo ML
- `:user_only` - Solo usuario (alta calidad garantizada)

**Ubicación**: `lib/tailorr/captcha/smart_solver.ex`
**Tests**: `test/tailorr/captcha/smart_solver_test.exs`

## Frontend de Clasificación

### LiveView (`TailorrWeb.CaptchaReviewSimpleLive`)

UI para revisar y clasificar CAPTCHAs fallidos:
- Selector de tracker
- Tabs: Fallidos / Exitosos / Clasificados
- Formulario de clasificación (solución, categoría, notas)
- Estadísticas en tiempo real
- Exportar training data

**Ubicación**: `lib/tailorr_web/live/captcha_review_simple_live.ex`
**Ruta**: Agregar a router como `/captcha/review`

## Trainer ML

### CaptchaTrainer (`Tailorr.ML.CaptchaTrainer`)

Entrenamiento en Elixir puro con Nx/Axon:
- Arquitectura CNN-RNN
- Lee datos de FileStorage
- Exporta modelo `.axon`
- Sin necesidad de Python

**Ubicación**: `lib/tailorr/ml/captcha_trainer.ex`

También incluye script Python opcional:
**Ubicación**: `priv/ml/train_captcha_model.py`

## Configuración

```elixir
# config/config.exs
config :tailorr, :captcha_backend, :telegram  # o :ml, :ocr, :manual

config :tailorr, :telegram_captcha,
  bot_token: System.get_env("TELEGRAM_BOT_TOKEN"),
  chat_id: System.get_env("TELEGRAM_CHAT_ID")

config :tailorr, :ml_captcha,
  model: "microsoft/trocr-base-printed",
  learning_mode: true,
  training_dir: "priv/ml/captcha_training"
```

## Workflow de Aprendizaje

1. **Recolección** (1-2 semanas)
   - CAPTCHAs se resuelven normalmente
   - Todo se guarda automáticamente por tracker
   - Usuario responde → Alta calidad

2. **Clasificación**
   - Revisar en `/captcha/review`
   - Etiquetar fallos
   - Clasificar por categoría

3. **Entrenamiento**
   - Exportar training data por tracker
   - Entrenar modelo específico por tracker
   - Accuracy mejora con el tiempo

4. **Producción**
   - Usar modelo entrenado
   - Continuar aprendiendo

## Documentación

- `/docs/captcha.md` - Guía general de todos los backends
- `/docs/captcha-ml.md` - Guía completa ML y entrenamiento

## Decisiones Arquitectónicas Clave

**Why:** Por qué ciertas decisiones fueron tomadas

### Files over Database
- **Decisión**: Sistema basado en archivos en lugar de DB
- **Razón**: Portabilidad, simplicidad, fácil inspección manual
- **Trade-off**: Menos queries complejas, pero suficiente para este caso

### Organization by Tracker
- **Decisión**: Organizar datasets por tracker/dominio
- **Razón**: Cada tracker tiene CAPTCHAs diferentes, modelos específicos funcionan mejor
- **Beneficio**: Entrenar modelo por tracker, mejor accuracy

### Cascade Strategy
- **Decisión**: Intentar ML primero, usuario como fallback
- **Razón**: ML rápido pero puede fallar, usuario lento pero preciso
- **Beneficio**: Mejor de ambos mundos + datos para mejorar ML

### User Solutions = High Quality
- **Decisión**: Priorizar soluciones de usuario para training
- **Razón**: Son ground truth verificado, máxima confianza
- **Uso**: Exportar con `quality: :high` solo incluye estos
