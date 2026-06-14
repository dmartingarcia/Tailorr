# CAPTCHA System - Quick Reference

## Resumen Ejecutivo

Sistema completo de resolución de CAPTCHAs con aprendizaje automático organizado por tracker/dominio.

**Estado**: ✅ Implementado y testeado (40+ tests)
**Fecha**: 2026-06-14

## Quick Start

```elixir
# Resolver CAPTCHA con estrategia inteligente
captcha = %{
  image: "https://tracker.com/captcha.php",
  image_type: :url,
  tracker: "tracker.com"  # Opcional, se detecta de URL
}

# Automático: ML → Usuario si falla
Tailorr.Captcha.SmartSolver.solve(captcha)

# Solo ML
Tailorr.Captcha.solve(captcha, :ml)

# Solo Usuario (Telegram)
Tailorr.Captcha.solve(captcha, :telegram)
```

## Archivos Clave

### Código Principal
- `lib/tailorr/captcha.ex` - Interface principal
- `lib/tailorr/captcha/file_storage.ex` - Sistema de archivos
- `lib/tailorr/captcha/smart_solver.ex` - Solver inteligente
- `lib/tailorr/captcha/solvers/*.ex` - Backends individuales

### Tests
- `test/tailorr/captcha/file_storage_test.exs` - 70+ tests
- `test/tailorr/captcha/smart_solver_test.exs`
- `test/tailorr/captcha_test.exs`

### UI
- `lib/tailorr_web/live/captcha_review_simple_live.ex` - LiveView clasificación

### Docs
- `docs/captcha.md` - Guía general
- `docs/captcha-ml.md` - Guía ML/training

## Estructura de Datos

```
priv/ml/captcha_learning/
  {tracker}/
    success/     # UUID_SOLUCION.jpg
    failed/      # UUID.jpg
    classified/
      {categoria}/
```

## Comandos Útiles

```elixir
# Estadísticas
Tailorr.Captcha.FileStorage.stats()
Tailorr.Captcha.FileStorage.stats("tracker.com")

# Listar fallos
Tailorr.Captcha.FileStorage.list_failed()
Tailorr.Captcha.FileStorage.list_failed("tracker.com")

# Clasificar
Tailorr.Captcha.FileStorage.classify("tracker.com", "abc123.jpg",
  solution: "CORRECT",
  category: "distorted",
  notes: "Muy distorsionado"
)

# Exportar training data
Tailorr.Captcha.FileStorage.export_training_data()
Tailorr.Captcha.FileStorage.export_training_data(tracker: "tracker.com")
```

## Next Steps (Futuro)

1. ❌ Implementar Bumblebee en ML solver
2. ❌ Agregar ruta `/captcha/review` al router
3. ❌ Servir archivos estáticos desde `/ml/captcha_learning/`
4. ❌ Entrenar primer modelo con datos recolectados
5. ❌ Integrar con sistema de trackers

## Testing

```bash
# Todos los tests
mix test test/tailorr/captcha

# Solo FileStorage
mix test test/tailorr/captcha/file_storage_test.exs

# Tests de integración (requieren setup)
mix test --only integration
```

## Configuración Requerida

### Telegram
```bash
export TELEGRAM_BOT_TOKEN="123:ABC..."
export TELEGRAM_CHAT_ID="123456789"
```

### OCR (Tesseract)
```bash
# macOS
brew install tesseract imagemagick

# Ubuntu
apt-get install tesseract-ocr imagemagick
```

### ML (Bumblebee/Nx)
```elixir
# mix.exs
{:bumblebee, "~> 0.5"},
{:nx, "~> 0.7"},
{:exla, "~> 0.7"}
```
