# This file is to test the model:
#  https://huggingface.co/facebook/nllb-200-distilled-600M?library=transformers


from transformers import pipeline
from transformers import Pipeline
import torch
import time

import nltk  # Natural Language processing library
from nltk.tokenize import sent_tokenize



class TranslatorModel():
    """Contains the model that translates languages"""

    def __init__(self):
        nltk.download('punkt') # download tokenizer libraries
        nltk.download('punkt_tab')


    def generate(self, prompt: str, src_lang: str, tgt_lang: str) -> str:
        """Uses the facebook nllb-200-distilled-1.3B model to translate the
        string: prompt. """

        # Split the input data into sentences (massively improves translation)
        batches = self._split_by_sentence(prompt)
        print("Tokenizer produced:")
        print(batches)
        print("--------end of tokenization---------------")

        # Set device (0 for GPU, -1 for CPU)
        device = 0 if torch.cuda.is_available() else -1
        print(f"Using device: {'GPU' if device == 0 else 'CPU'}")


        # Load translation model on the correct device
        pipe = pipeline("translation", model="facebook/nllb-200-distilled-1.3B", device=device)

        return_var = ""
        for i in range(len(batches)):
            var = self._prompt_model(batches[i], src_lang=src_lang, tgt_lang=tgt_lang, pipe=pipe, debug=True)
            print(f"batch {i}: {var}\n")
            return_var += var

        print("Translated:--------")
        print(return_var)
        return return_var



    def _split_by_sentence(self, long_string: str) -> list[str]:
        """This function takes a long string and will split it into complete
        sentences, up to length SPLIT_LIMIT. Returns a list of sentences
        """

        # Split the paragraph into sentences
        sentences = sent_tokenize(long_string)

        sentences = [item.replace("\n", " ") for item in sentences]

        return sentences



    def _prompt_model(self, prompt: str, pipe: Pipeline, src_lang: str,
                       tgt_lang: str, debug=False) -> str:
        """Takes a prompt and asks the model to translate it from src_lang to
        tgt_lang."""

        if debug:
            start = time.time()

        if debug:
            print(f"--src: {src_lang}, --tgt: {tgt_lang}")

        # Translate text
        result = pipe(prompt, src_lang=src_lang, tgt_lang=tgt_lang)

        if debug:
            end = time.time()
            print(f"Time of 1.3B: {end - start}")

        # Print translation
        return result[0]['translation_text']  + " "






if __name__ == '__main__':

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
    translation = TranslatorModel()

    var = translation.generate(long_sentence)

    print("final string\n")
    print(var)
