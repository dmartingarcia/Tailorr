# CAPTCHA Solving System

Tailorr includes a pluggable CAPTCHA solving system with multiple backend implementations.

## Available Backends

### 1. Mock (Testing)

Always returns a configured response. Useful for testing.

```elixir
captcha = %{image: "test.png", image_type: :url}

# Default solution
Tailorr.Captcha.solve(captcha, :mock)
#=> {:ok, "MOCK123"}

# Custom solution
Tailorr.Captcha.solve(captcha, :mock, solution: "ABC123")
#=> {:ok, "ABC123"}

# Simulate errors
Tailorr.Captcha.solve(captcha, :mock, error: true, error_reason: :timeout)
#=> {:error, :timeout}

# Simulate delay
Tailorr.Captcha.solve(captcha, :mock, delay: 1000, solution: "TEST")
#=> {:ok, "TEST"} (after 1 second)
```

### 2. Machine Learning (Trainable) ⭐

**NEW!** Backend con capacidades de entrenamiento usando Nx/Axon/Bumblebee.

```elixir
# Usar modelo pre-entrenado
Tailorr.Captcha.solve(captcha, :ml)
#=> {:ok, "ABC123"}

# Recolectar datos y entrenar tu propio modelo
Tailorr.Captcha.Solvers.ML.mark_correct(captcha, "ABC123")
Tailorr.ML.CaptchaTrainer.train(data_dir: "priv/ml/captcha_training")
```

**Ver [docs/captcha-ml.md](captcha-ml.md) para guía completa de entrenamiento.**

### 3. Manual (CLI Input)

Prompts for human input via CLI. Good for development.

```elixir
captcha = %{
  image: "https://example.com/captcha.png",
  image_type: :url,
  message: "Enter the characters you see"
}

Tailorr.Captcha.solve(captcha, :manual)
# Displays image URL and prompts for input
# User types: ABC123
#=> {:ok, "ABC123"}
```

### 3. OCR (Tesseract)

Uses Tesseract OCR for simple image-based CAPTCHAs. Works well with old-style PHP CAPTCHAs.

**Requirements:**
```bash
# macOS
brew install tesseract imagemagick

# Ubuntu/Debian
apt-get install tesseract-ocr imagemagick

# Alpine (Docker)
apk add tesseract-ocr imagemagick
```

**Usage:**
```elixir
# Simple digit CAPTCHA
captcha = %{
  image: "https://site.com/captcha.php",
  image_type: :url
}

Tailorr.Captcha.solve(captcha, :ocr, whitelist: "0123456789")
#=> {:ok, "492851"}

# Alphanumeric CAPTCHA
Tailorr.Captcha.solve(captcha, :ocr, 
  whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  psm: 7  # Page segmentation mode: single line
)
#=> {:ok, "A8KQ7"}

# Base64 image
captcha = %{
  image: "data:image/png;base64,iVBORw0KGgo...",
  image_type: :base64
}
Tailorr.Captcha.solve(captcha, :ocr)
#=> {:ok, "XK2D"}
```

**Options:**
- `:whitelist` - Characters to recognize (e.g., `"0123456789"` for digits only)
- `:psm` - Page segmentation mode (default: 7)
  - `6` = uniform block of text
  - `7` = single line (best for CAPTCHAs)
  - `8` = single word
  - `10` = single character
- `:preprocessing` - Enable image preprocessing (default: `true`)
- `:lang` - Language data (default: `"eng"`)

### 4. Telegram Bot

Sends CAPTCHA to a Telegram channel/chat and waits for human response.

**Setup:**

1. Create a Telegram bot via [@BotFather](https://t.me/BotFather)
2. Get the bot token
3. Get your chat ID:
   - Send a message to your bot
   - Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - Look for `"chat":{"id":123456789}`
4. Configure environment variables:

```bash
export TELEGRAM_BOT_TOKEN="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
export TELEGRAM_CHAT_ID="123456789"
```

Or in `config/config.exs`:
```elixir
config :tailorr, :telegram_captcha,
  bot_token: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
  chat_id: "123456789"
```

**Usage:**
```elixir
captcha = %{
  image: "https://example.com/captcha.png",
  image_type: :url,
  message: "🔐 Enter the code from this CAPTCHA"
}

# Will send to Telegram and wait for reply
Tailorr.Captcha.solve(captcha, :telegram, timeout: 120_000)
#=> {:ok, "ABC123"}
```

**How it works:**
1. Bot sends the CAPTCHA image to your configured chat
2. You reply to that message with the solution
3. Bot detects your reply and returns the solution
4. Timeout after 2 minutes (configurable)

**Options:**
- `:timeout` - Wait time in milliseconds (default: 120,000 = 2 min)
- `:poll_interval` - How often to check for replies (default: 2000 = 2 sec)
- `:bot_token` - Override bot token from config
- `:chat_id` - Override chat ID from config

### 5. 2Captcha / Anti-Captcha (Coming Soon)

Commercial CAPTCHA solving services.

```elixir
# Not yet implemented
Tailorr.Captcha.solve(captcha, :twocaptcha)
#=> {:error, :not_implemented}
```

## Configuration

Set default backend in `config/config.exs`:

```elixir
# Use Telegram for all CAPTCHAs by default
config :tailorr, :captcha_backend, :telegram

config :tailorr, :telegram_captcha,
  bot_token: System.get_env("TELEGRAM_BOT_TOKEN"),
  chat_id: System.get_env("TELEGRAM_CHAT_ID")
```

## Usage in Trackers

Trackers can use the CAPTCHA system when encountering CAPTCHAs:

```elixir
# In your tracker agent
case detect_captcha(response) do
  {:captcha_required, captcha_data} ->
    case Tailorr.Captcha.solve(captcha_data) do
      {:ok, solution} ->
        # Submit solution and retry request
        retry_with_solution(solution)
        
      {:error, reason} ->
        {:error, {:captcha_failed, reason}}
    end
    
  {:ok, data} ->
    # No CAPTCHA, proceed normally
    parse_results(data)
end
```

## Architecture

The system follows SOLID principles with a behaviour-based design:

- `Tailorr.Captcha` - Main interface
- `Tailorr.Captcha.Solver` - Behaviour defining the contract
- `Tailorr.Captcha.Solvers.*` - Individual backend implementations

Adding a new backend:
1. Create a module implementing `@behaviour Tailorr.Captcha.Solver`
2. Implement `solve/2` callback
3. Add to the backends map in `Tailorr.Captcha`

## Testing

```elixir
# Use mock backend in tests
test "handles CAPTCHA" do
  captcha = build_captcha()
  
  # Always succeeds with known solution
  {:ok, solution} = Tailorr.Captcha.solve(captcha, :mock, solution: "TEST123")
  assert solution == "TEST123"
end

# Simulate CAPTCHA errors
test "handles CAPTCHA failure" do
  captcha = build_captcha()
  
  {:error, :mock_error} = Tailorr.Captcha.solve(
    captcha, 
    :mock, 
    error: true, 
    error_reason: :mock_error
  )
end
```

## Troubleshooting

### OCR Backend

**"tesseract_not_found"**
- Install Tesseract: `brew install tesseract` (macOS) or `apt-get install tesseract-ocr` (Ubuntu)

**Poor accuracy**
- Try different PSM modes (`:psm` option)
- Use character whitelist (`:whitelist` option)
- Enable preprocessing (`:preprocessing` option, enabled by default)
- Install ImageMagick for better preprocessing

### Telegram Backend

**"missing_bot_token"**
- Set `TELEGRAM_BOT_TOKEN` environment variable
- Or configure in `config/config.exs`

**"missing_chat_id"**
- Set `TELEGRAM_CHAT_ID` environment variable
- Get chat ID from `https://api.telegram.org/bot<TOKEN>/getUpdates`

**Timeout**
- Increase timeout: `solve(captcha, :telegram, timeout: 300_000)` (5 min)
- Bot must be running and accessible
- You must reply to the exact message (use "Reply" feature)
