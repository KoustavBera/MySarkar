import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from IndicTransToolkit.processor import IndicProcessor

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL_ID = "ai4bharat/indictrans2-indic-en-dist-200M"

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, trust_remote_code=True)
model = AutoModelForSeq2SeqLM.from_pretrained(
    MODEL_ID, trust_remote_code=True, torch_dtype="auto"
).to(DEVICE).eval()

ip = IndicProcessor(inference=True)
def translate_text(text: str, language: str = "hi", max_len: int = 256) -> str:
    try:
        # Map frontend language codes to IndicTrans codes
        lang_map = {
            "hi": "hin_Deva",
            "bn": "ben_Beng", 
            "or": "ory_Orya",
            "kn": "kan_Knda"
        }
        
        src_lang = lang_map.get(language, "hin_Deva")
        tgt_lang = "eng_Latn"

        # 1. Preprocess
        batch = ip.preprocess_batch([text], src_lang=src_lang, tgt_lang=tgt_lang)
        print("Preprocessed batch:", batch)
        if not batch or not batch[0].strip():
            raise ValueError("Preprocessor returned empty input.")

        # 2. Tokenize
        enc = tokenizer(
            batch,
            truncation=True,
            padding="longest",
            return_tensors="pt"
        )

        # Debug: print keys and shapes/types
        for k, v in enc.items():
            print(f"enc key: {k} type: {type(v)}", end="")
            if hasattr(v, "shape"):
                print(f" shape: {v.shape} device: {v.device}")
            else:
                print(" (no shape)")

        # 3. Move tensors explicitly to model device
        enc = {k: v.to(DEVICE) for k, v in enc.items() if v is not None}
        print("input device:", enc['input_ids'].device, "model device:", next(model.parameters()).device)

        # 4. Token ids and config debug
        print("tokenizer.pad_token_id:", tokenizer.pad_token_id)
        print("tokenizer.eos_token_id:", tokenizer.eos_token_id)
        print("model.config.is_encoder_decoder:", getattr(model.config, "is_encoder_decoder", None))
        print("model.config.decoder_start_token_id:", getattr(model.config, "decoder_start_token_id", None))

        # 5. Try to find a reasonable decoder_start_token_id for target language
        # Many IndicTrans variants include language tokens like '<2eng_Latn>' in vocab.
        cand = "<2eng_Latn>"
        cand_id = tokenizer.convert_tokens_to_ids(cand)
        print(f"convert_tokens_to_ids('{cand}') ->", cand_id)
        decoder_start_id = model.config.decoder_start_token_id or (cand_id if cand_id != tokenizer.unk_token_id else None)
        print("using decoder_start_token_id:", decoder_start_id)

        # 6. Safeguard pad/eos token ids
        pad_id = tokenizer.pad_token_id if tokenizer.pad_token_id is not None else tokenizer.eos_token_id
        eos_id = tokenizer.eos_token_id if tokenizer.eos_token_id is not None else pad_id
        if pad_id is None or eos_id is None:
            raise ValueError("tokenizer.pad_token_id and tokenizer.eos_token_id are both None")

        # 7. Try generate with two fallbacks:
        # First try standard call; if it fails, try with return_dict_in_generate & use_cache=False & explicit decoder_start_token_id
        try:
            with torch.no_grad():
                outputs = model.generate(
                    input_ids=enc["input_ids"],
                    attention_mask=enc.get("attention_mask", None),
                    max_length=max_len,
                    num_beams=4,
                    pad_token_id=pad_id,
                    eos_token_id=eos_id,
                )
        except Exception as e1:
            print("generate failed first attempt:", e1)
            # second attempt with explicit decoder_start_token_id and disabling use_cache
            gen_kwargs = dict(
                input_ids=enc["input_ids"],
                attention_mask=enc.get("attention_mask", None),
                max_length=max_len,
                num_beams=4,
                pad_token_id=pad_id,
                eos_token_id=eos_id,
                use_cache=False,
                return_dict_in_generate=True,
            )
            if decoder_start_id is not None:
                gen_kwargs["decoder_start_token_id"] = int(decoder_start_id)
            print("generate retry kwargs:", {k: (v if k!="input_ids" else f"tensor(shape={enc['input_ids'].shape})") for k,v in gen_kwargs.items()})
            with torch.no_grad():
                outobj = model.generate(**gen_kwargs)
                # outobj may be a GenerationOutput when return_dict_in_generate=True
                # If so, get sequences
                outputs = outobj.sequences if hasattr(outobj, "sequences") else outobj

        # 8. Final debug on outputs
        print("outputs type:", type(outputs))
        if hasattr(outputs, "shape"):
            print("outputs shape:", outputs.shape)

        # 9. Decode & postprocess
        decoded = tokenizer.batch_decode(outputs, skip_special_tokens=True)
        out = ip.postprocess_batch(decoded, lang=tgt_lang)
        print("Decoded output:", decoded)
        return out[0] if out else ""

    except Exception as e:
        print(f"Translation error: {e}")
        return text
        