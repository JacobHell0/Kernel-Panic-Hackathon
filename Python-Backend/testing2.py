from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch

# Load model and tokenizer (force correct tokenizer)
model_name = "facebook/nllb-200-distilled-600M"
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load model & tokenizer correctly
model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(device)
tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=False)  # Ensure correct tokenizer

# Define input text and language codes
src_text = "Hello, how are you?"
src_lang = "eng_Latn"
tgt_lang = "fra_Latn"

# **Set source language correctly**
tokenizer.src_lang = src_lang

# Tokenize input
inputs = tokenizer(src_text, return_tensors="pt").to(device)

# **Ensure target language is set correctly**
forced_bos_token_id = tokenizer.convert_tokens_to_ids(tgt_lang)

# Generate translation
with torch.no_grad():
    output_tokens = model.generate(**inputs, forced_bos_token_id=forced_bos_token_id)

# Decode output
translated_text = tokenizer.batch_decode(output_tokens, skip_special_tokens=True)[0]
print(translated_text)
