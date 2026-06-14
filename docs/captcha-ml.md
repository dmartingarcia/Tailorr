# Machine Learning CAPTCHA Backend

Backend de CAPTCHA con capacidades de entrenamiento usando **100% Elixir** (Nx/Axon/Bumblebee).

## Características

- ✅ **Entrenamiento en Elixir puro** - Sin Python, todo Nx/Axon
- ✅ **Modo de aprendizaje** - Recolecta ejemplos automáticamente
- ✅ **Feedback loop** - Marca soluciones correctas/incorrectas
- ✅ **Modelos pre-entrenados** - Usa modelos de HuggingFace vía Bumblebee
- ✅ **Fine-tuning** - Entrena con tus propios ejemplos
- ✅ **Estadísticas** - Monitorea accuracy y progreso

## Setup

### Dependencias

Agregar a `mix.exs`:

```elixir
defp deps do
  [
    # Machine Learning
    {:axon, "~> 0.6"},        # Neural networks
    {:nx, "~> 0.7"},          # Numerical computing
    {:exla, "~> 0.7"},        # XLA compiler (GPU/CPU)
    {:bumblebee, "~> 0.5"},   # HuggingFace models
    {:stb_image, "~> 0.6"}    # Image loading
  ]
end
```

### Configuración

En `config/config.exs`:

```elixir
config :tailorr, :ml_captcha,
  # Modelo pre-entrenado de HuggingFace
  model: "microsoft/trocr-base-printed",
  
  # Guardar ejemplos para entrenamiento
  learning_mode: true,
  
  # Directorio de datos de entrenamiento
  training_dir: "priv/ml/captcha_training"

# Backend por defecto
config :tailorr, :captcha_backend, :ml
```

### Configurar EXLA (Aceleración)

```bash
# CPU (default)
export XLA_TARGET=cpu

# GPU (CUDA)
export XLA_TARGET=cuda
export XLA_FLAGS=--xla_gpu_cuda_data_dir=/usr/local/cuda
```

## Uso Básico

### 1. Resolver CAPTCHAs con Modelo Pre-entrenado

```elixir
captcha = %{
  image: "https://example.com/captcha.png",
  image_type: :url
}

# Usa modelo pre-entrenado de HuggingFace
Tailorr.Captcha.solve(captcha, :ml)
#=> {:ok, "ABC123"}
```

### 2. Modo de Aprendizaje (Recolección de Datos)

Cuando el modo de aprendizaje está activo, cada CAPTCHA resuelto se guarda automáticamente:

```elixir
# Resuelve y guarda ejemplo
{:ok, prediction} = Tailorr.Captcha.solve(captcha, :ml)

# Marca como correcto
Tailorr.Captcha.Solvers.ML.mark_correct(captcha, prediction)

# O marca como incorrecto y proporciona la solución correcta
Tailorr.Captcha.Solvers.ML.mark_incorrect(captcha, prediction, correct: "XYZ789")
```

### 3. Ver Estadísticas

```elixir
{:ok, stats} = Tailorr.Captcha.Solvers.ML.training_stats()

# %{
#   total: 500,
#   labeled: 450,
#   correct: 380,
#   incorrect: 70,
#   unlabeled: 50,
#   accuracy: 84.44
# }
```

### 4. Exportar Datos de Entrenamiento

```elixir
# Exporta ejemplos etiquetados a filesystem
{:ok, count} = Tailorr.Captcha.Solvers.ML.export_training_data()
#=> {:ok, 450}

# Estructura del directorio:
# priv/ml/captcha_training/
#   000000.png
#   000001.png
#   ...
#   labels.txt  # "000000.png\tABC123\n"
```

## Entrenamiento del Modelo

### Opción 1: Entrenamiento en Elixir (Recomendado)

```elixir
# En iex -S mix
Tailorr.ML.CaptchaTrainer.train(
  data_dir: "priv/ml/captcha_training",
  epochs: 50,
  batch_size: 32,
  learning_rate: 0.001,
  validation_split: 0.1,
  output_path: "priv/ml/trained_model.axon"
)

# Actualizar config para usar modelo entrenado:
# config :tailorr, :ml_captcha,
#   model: "priv/ml/trained_model.axon"
```

### Opción 2: Fine-tuning con Python (Opcional)

Si prefieres usar PyTorch/HuggingFace:

```bash
# Instalar dependencias Python
pip install transformers datasets torch pillow

# Entrenar
python priv/ml/train_captcha_model.py \
  --data priv/ml/captcha_training \
  --epochs 10 \
  --batch-size 8 \
  --output captcha_model_output

# Actualizar config:
# config :tailorr, :ml_captcha,
#   model: "captcha_model_output/final_model"
```

## Workflow Completo

### 1. Fase de Recolección (1-2 semanas)

```elixir
# Activar learning mode
# config :tailorr, :ml_captcha, learning_mode: true

# Resolver CAPTCHAs normalmente (usa modelo base)
Enum.each(captchas, fn captcha ->
  {:ok, prediction} = Tailorr.Captcha.solve(captcha, :ml)
  
  # Feedback manual o automático
  if correct?(prediction) do
    Tailorr.Captcha.Solvers.ML.mark_correct(captcha, prediction)
  else
    actual = get_actual_solution(captcha)
    Tailorr.Captcha.Solvers.ML.mark_incorrect(captcha, prediction, correct: actual)
  end
end)
```

### 2. Fase de Entrenamiento

```elixir
# Verificar estadísticas
{:ok, stats} = Tailorr.Captcha.Solvers.ML.training_stats()
IO.inspect(stats)

# Si tienes suficientes ejemplos (>500 recomendado)
if stats.labeled > 500 do
  # Exportar datos
  Tailorr.Captcha.Solvers.ML.export_training_data()
  
  # Entrenar modelo
  Tailorr.ML.CaptchaTrainer.train(
    data_dir: "priv/ml/captcha_training",
    epochs: 50,
    batch_size: 32
  )
end
```

### 3. Fase de Producción

```elixir
# Actualizar config para usar modelo entrenado
# config :tailorr, :ml_captcha,
#   model: "priv/ml/trained_model.axon",
#   learning_mode: false  # Desactivar recolección

# Usar en producción
{:ok, solution} = Tailorr.Captcha.solve(captcha, :ml)
```

## Arquitectura del Modelo (Nx/Axon)

### Arquitectura CNN-RNN

```
Input (64x256 grayscale image)
         ↓
    [Conv2D 32] → ReLU → MaxPool
         ↓
    [Conv2D 64] → ReLU → MaxPool
         ↓
    [Conv2D 128] → ReLU → MaxPool
         ↓
      Flatten
         ↓
    [Dense 256] → ReLU
         ↓
    Reshape to (batch, 8, 32)  # 8 positions
         ↓
    [LSTM 128] → sequences
         ↓
    [LSTM 64] → sequences
         ↓
    [Dense 37] → Softmax  # 36 chars + blank
         ↓
    Output (character per position)
```

### Por qué esta arquitectura?

- **CNN**: Extrae características visuales robustas a distorsiones
- **RNN (LSTM)**: Procesa secuencia de caracteres con contexto
- **Multiple positions**: Predice cada carácter independientemente
- **CTC Loss**: Maneja longitudes variables

## Modelos Pre-entrenados Disponibles

### HuggingFace (vía Bumblebee)

```elixir
# Texto impreso (mejor para CAPTCHAs)
config :tailorr, :ml_captcha,
  model: "microsoft/trocr-base-printed"

# Texto manuscrito
config :tailorr, :ml_captcha,
  model: "microsoft/trocr-base-handwritten"

# Modelo multilingüe
config :tailorr, :ml_captcha,
  model: "microsoft/trocr-large-stage1"
```

## Performance

### CPU vs GPU

```elixir
# CPU (EXLA)
# ~50-100ms por CAPTCHA
# Batch size: 1-4

# GPU (CUDA + EXLA)  
# ~5-15ms por CAPTCHA
# Batch size: 32-128
```

### Accuracy Esperada

- **Modelo base (sin fine-tuning)**: 40-60%
- **Con 500 ejemplos**: 70-80%
- **Con 2000+ ejemplos**: 85-95%
- **Con 5000+ ejemplos**: 95%+

## Troubleshooting

### Error: "bumblebee_not_available"

```bash
# Agregar dependencias
mix deps.get
```

### Entrenamiento muy lento

```bash
# Usar EXLA compiler
export XLA_TARGET=cpu
mix compile

# O usar GPU
export XLA_TARGET=cuda
```

### Out of Memory

```elixir
# Reducir batch size
Tailorr.ML.CaptchaTrainer.train(
  data_dir: "priv/ml/captcha_training",
  batch_size: 8  # En vez de 32
)
```

### Accuracy muy baja

- Recolectar más ejemplos (>1000 recomendado)
- Verificar calidad de labels (usar `training_stats`)
- Aumentar epochs (50-100)
- Ajustar learning rate (probar 0.0001 - 0.01)
- Agregar data augmentation (rotación, ruido)

## Comparación: Python vs Elixir

| Aspecto | Python (PyTorch) | Elixir (Nx/Axon) |
|---------|-----------------|------------------|
| Setup | Complejo (venv, CUDA) | Simple (mix deps.get) |
| Velocidad | Similar | Similar (con EXLA) |
| Productividad | Notebooks, debugging | iex, LiveView |
| Integración | Requiere API/FFI | Nativo |
| Deployment | Container separado | Todo en BEAM |
| Mantenimiento | 2 stacks | 1 stack |

## Próximos Pasos

1. **Recolectar datos**: Activar learning mode y resolver CAPTCHAs
2. **Etiquetar ejemplos**: Dar feedback (correct/incorrect)
3. **Entrenar**: Una vez que tengas >500 ejemplos
4. **Evaluar**: Verificar accuracy en validation set
5. **Iterar**: Recolectar más ejemplos de errores
6. **Producción**: Desactivar learning mode, usar modelo entrenado

## Ejemplo Completo

```elixir
# config/config.exs
config :tailorr, :captcha_backend, :ml
config :tailorr, :ml_captcha,
  model: "microsoft/trocr-base-printed",
  learning_mode: true,
  training_dir: "priv/ml/captcha_training"

# Resolver y aprender
captcha = %{image: "https://site.com/captcha.php", image_type: :url}

{:ok, prediction} = Tailorr.Captcha.solve(captcha, :ml)
# => {:ok, "AB1234"}

# Verificar manualmente y dar feedback
Tailorr.Captcha.Solvers.ML.mark_correct(captcha, "AB1234")

# Después de recolectar ejemplos...
{:ok, stats} = Tailorr.Captcha.Solvers.ML.training_stats()
# => %{total: 1000, labeled: 950, correct: 850, incorrect: 100, accuracy: 89.47}

# Entrenar modelo customizado
Tailorr.ML.CaptchaTrainer.train(
  data_dir: "priv/ml/captcha_training",
  epochs: 50
)

# Usar modelo entrenado
# (actualizar config para apuntar al modelo nuevo)
```
