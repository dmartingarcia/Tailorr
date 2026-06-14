#!/usr/bin/env python3
"""
CAPTCHA Model Training Script

Fine-tunes a TrOCR model on collected CAPTCHA examples.

Requirements:
    pip install transformers datasets torch pillow

Usage:
    python train_captcha_model.py --data priv/ml/captcha_training --epochs 10

The training data should be in format:
    priv/ml/captcha_training/
        000000.png
        000001.png
        ...
        labels.txt  # Format: "000000.png\tABC123\n"
"""

import argparse
import os
from pathlib import Path

import torch
from PIL import Image
from torch.utils.data import Dataset, DataLoader
from transformers import (
    TrOCRProcessor,
    VisionEncoderDecoderModel,
    Seq2SeqTrainer,
    Seq2SeqTrainingArguments,
    default_data_collator,
)


class CaptchaDataset(Dataset):
    """Dataset for CAPTCHA images and labels."""

    def __init__(self, data_dir, processor, max_length=8):
        self.data_dir = Path(data_dir)
        self.processor = processor
        self.max_length = max_length
        self.samples = self._load_labels()

    def _load_labels(self):
        """Load labels from labels.txt file."""
        labels_file = self.data_dir / "labels.txt"
        samples = []

        with open(labels_file, "r") as f:
            for line in f:
                parts = line.strip().split("\t")
                if len(parts) == 2:
                    image_file, label = parts
                    image_path = self.data_dir / image_file
                    if image_path.exists():
                        samples.append((str(image_path), label))

        print(f"Loaded {len(samples)} training samples")
        return samples

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        image_path, label = self.samples[idx]

        # Load image
        image = Image.open(image_path).convert("RGB")

        # Process image
        pixel_values = self.processor(image, return_tensors="pt").pixel_values

        # Encode label
        labels = self.processor.tokenizer(
            label,
            padding="max_length",
            max_length=self.max_length,
            truncation=True,
        ).input_ids

        # Replace padding token id with -100 (ignored by loss)
        labels = [
            label if label != self.processor.tokenizer.pad_token_id else -100
            for label in labels
        ]

        return {
            "pixel_values": pixel_values.squeeze(),
            "labels": torch.tensor(labels),
        }


def compute_metrics(pred):
    """Compute accuracy metrics."""
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)

    # Calculate accuracy
    mask = labels != -100
    accuracy = (preds[mask] == labels[mask]).mean()

    return {"accuracy": accuracy}


def train(args):
    """Train the CAPTCHA model."""
    print(f"Training CAPTCHA model...")
    print(f"Data directory: {args.data}")
    print(f"Base model: {args.model}")
    print(f"Epochs: {args.epochs}")
    print(f"Batch size: {args.batch_size}")
    print()

    # Load processor and model
    print("Loading base model...")
    processor = TrOCRProcessor.from_pretrained(args.model)
    model = VisionEncoderDecoderModel.from_pretrained(args.model)

    # Set decoder start token
    model.config.decoder_start_token_id = processor.tokenizer.cls_token_id
    model.config.pad_token_id = processor.tokenizer.pad_token_id

    # Load dataset
    print("Loading training data...")
    dataset = CaptchaDataset(args.data, processor, max_length=args.max_length)

    # Split into train/validation
    train_size = int(0.9 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = torch.utils.data.random_split(
        dataset, [train_size, val_size]
    )

    print(f"Training samples: {len(train_dataset)}")
    print(f"Validation samples: {len(val_dataset)}")
    print()

    # Training arguments
    training_args = Seq2SeqTrainingArguments(
        output_dir=args.output,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        per_device_eval_batch_size=args.batch_size,
        learning_rate=args.learning_rate,
        eval_strategy="epoch",
        save_strategy="epoch",
        save_total_limit=3,
        load_best_model_at_end=True,
        metric_for_best_model="accuracy",
        greater_is_better=True,
        logging_steps=10,
        report_to="none",
    )

    # Trainer
    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        data_collator=default_data_collator,
        compute_metrics=compute_metrics,
    )

    # Train
    print("Starting training...")
    trainer.train()

    # Save final model
    final_model_path = Path(args.output) / "final_model"
    print(f"\nSaving final model to {final_model_path}")
    model.save_pretrained(final_model_path)
    processor.save_pretrained(final_model_path)

    print("\nTraining complete!")
    print(f"Model saved to: {final_model_path}")
    print(f"\nTo use in Tailorr, update config:")
    print(f'  config :tailorr, :ml_captcha,')
    print(f'    model: "{final_model_path.absolute()}"')


def main():
    parser = argparse.ArgumentParser(description="Train CAPTCHA OCR model")
    parser.add_argument(
        "--data",
        type=str,
        required=True,
        help="Directory containing training images and labels.txt",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="./captcha_model_output",
        help="Output directory for trained model",
    )
    parser.add_argument(
        "--model",
        type=str,
        default="microsoft/trocr-base-printed",
        help="Base HuggingFace model to fine-tune",
    )
    parser.add_argument(
        "--epochs",
        type=int,
        default=10,
        help="Number of training epochs",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=8,
        help="Training batch size",
    )
    parser.add_argument(
        "--learning-rate",
        type=float,
        default=5e-5,
        help="Learning rate",
    )
    parser.add_argument(
        "--max-length",
        type=int,
        default=8,
        help="Maximum CAPTCHA text length",
    )

    args = parser.parse_args()
    train(args)


if __name__ == "__main__":
    main()
