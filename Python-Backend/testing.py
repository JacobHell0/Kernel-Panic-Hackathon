# This file is to test the model:
#  https://huggingface.co/facebook/nllb-200-distilled-600M?library=transformers


from transformers import pipeline
from transformers import Pipeline
import torch
import time

def generate(prompt: str):

    SPLIT_LIMIT = 50 # approximate words to be split

    split_prompt = prompt.split()
    batches = []

    # Create batches based on SPLIT_LIMIT
    for i in range(0, len(split_prompt), SPLIT_LIMIT):
        batches.append(" ".join(split_prompt[i:i + SPLIT_LIMIT]))

    for i in range(len(batches)):
        print(f"Input {i}: {batches[i]}")

    # Set device (0 for GPU, -1 for CPU)
    device = 0 if torch.cuda.is_available() else -1
    print(f"Using device: {'GPU' if device == 0 else 'CPU'}")


    # Load translation model on the correct device
    pipe = pipeline("translation", model="facebook/nllb-200-distilled-1.3B", device=device)

    return_var = ""
    for i in range(len(batches)):
        var = prompt_model(batches[i], pipe=pipe, debug=True)
        print(f"batch {i}: {var}\n")
        return_var += var

    return return_var


def prompt_model(prompt: str, pipe: Pipeline, debug=False) -> str:

    if debug:
        start = time.time()
    # Translate text (example: English to French)
    result = pipe(prompt, src_lang="eng_Latn", tgt_lang="fra_Latn")

    if debug:
        end = time.time()
        print(f"Time of 1.3B: {end - start}")

    # Print translation
    return result[0]['translation_text']






if __name__ == '__main__':
    # generate("test")

    long_sentence = """Bee Movie
By Jerry Seinfeld

NARRATOR:
(Black screen with text; The sound of buzzing bees can be heard)
According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible.

BARRY BENSON:
(Barry is picking out a shirt)
Yellow, black. Yellow, black. Yellow, black. Yellow, black.
Ooh, black and yellow! Let's shake it up a little.

JANET BENSON:
Barry! Breakfast is ready!


"""

    generate(long_sentence)