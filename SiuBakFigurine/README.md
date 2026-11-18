# Siu Bak Figurine

The two puppy drawings from the forest game, stood up in 3D:

**https://bonzili.me/SiuBakFigurine/**

One page, no build step. It loads `model-viewer` from `../vendor/` (vendored,
so the page makes no third-party requests) and two GLB models from
`../SiuBakForest/assets/models/`.

## What is here

| Path | Purpose |
| --- | --- |
| `index.html` | The whole page: styles, the shelf, the AR buttons |
| `../SiuBakForest/assets/models/siubak.glb` | Siu Bak, 20k triangles, ~0.7 MB |
| `../SiuBakForest/assets/models/siugaimo.glb` | Siu Gai Mo, 20k triangles, ~0.7 MB |
| `../SiuBakForest/assets/models/*.usdz` | The same two models for iPhone Quick Look AR |
| `../vendor/model-viewer.min.js` | Google's `<model-viewer>` web component |

The models are also shown at the end of the letter in the game's final screen,
loaded only when that screen is opened.

## How they were made

Both were generated from the drawings that already shipped in the game, using
Meshy. No photos of anyone were used; only `SiuBak.png` and `SiuGaiMo.png`.

1. Flatten the transparent sprite onto a tinted background so the white fur
   keeps its fill (`#A9E8D4`). Feeding a transparent PNG can invert the body
   into a black silhouette.
2. Draw a clean "product photo" reference for each character. The first
   attempt for Siu Bak read the scalloped outline as curly hair; the ear shapes
   in the drawing are ears, so the reference asks for a smooth dome head with
   two floppy side ears.
3. `meshy_image_to_3d` with `meshy-7.1` and the `meshy-7` texture model, 2K
   base colour, no PBR maps, `a-pose`.
4. `meshy_remesh` to 20,000 triangles. The first pass was 368k triangles and a
   10.8 MB GLB; nobody needs that on a phone.
5. Shrink the GLB textures to 1024px WebP with `@gltf-transform/cli`. 3.5 MB
   becomes 0.7 MB with no visible change at this size.

The high-resolution originals, the printable OBJ files and the discarded first
Siu Bak are kept in `meshy_output/`, which is git-ignored. Do not commit them:
the OBJ files are 18–36 MB each and git history is permanent.

## Regenerating

Regeneration is not part of the deploy. It needs a Meshy account and the MCP
server or API key, and it costs credits. The numbers below were the actual
spend for this pair, at the November 2026 pricing.

| Step | Credits |
| --- | --- |
| Four reference-image redraws (two of them dead ends) | 30 |
| Three `image_to_3d` runs at 2K texture (the first Siu Bak was rebuilt) | 90 |
| Three `remesh` runs | 15 |
| `convert` / downloads | 0 |
| **Total** | **141** |

Only ~88 of those were the pair that shipped; the rest was the Siu Bak ear
redo and two turnarounds that drifted into a black silhouette and a generic
bear. Expect roughly the same for a fresh pair.

After regenerating, re-run the texture squeeze:
```bash
npx @gltf-transform/cli@4 optimize in.glb out.glb \
  --compress false --simplify false \
  --texture-compress webp --texture-size 1024
```

Keep the result under ~1 MB per model. A `.usdz` is only fetched when someone
taps the AR button, so those can stay larger.

## Regeneration gotchas

Four things bit during the build. Check them first if a rebuilt model looks
wrong.

1. **Meshy exports facing +X, not +Z.** `model-viewer`'s default camera looks
   down −Z, so a fresh export shows the back. Rotate the root node −90° about Y
   (see `meshy_output/` scripts or any glTF tool); do not paper over it with
   `camera-orbit="90deg"`, because AR would still start sideways.
2. **`loading="lazy"` never fires** for these viewers — not in a background tab
   and not while the parent is `hidden`. The models simply never load. The
   game's diorama is already deferred by the dynamic import, so drop the
   attribute.
3. **`interaction-prompt="none"`** is needed, otherwise model-viewer draws its
   own hand icon over each face, twice on the two-up page.
4. **Flatten transparent sprites first.** A transparent PNG can come back as a
   black silhouette; compositing onto `#A9E8D4` fixes it.

## Printing

Both meshes pass the printability check: watertight, no holes, no non-manifold
edges. The only warnings are degenerate faces, which slicers tolerate; run a
repair pass if the slicer complains. At 90 mm tall the figures are about
72 × 46 × 90 mm (Siu Bak) and 81 × 45 × 90 mm (Siu Gai Mo), so they print
without supports on their backs and fit any common bed.

The printable OBJ files are in `meshy_output/print/`. They are not in the repo.

## Privacy

The page has no analytics, no cookies, no accounts and no third-party scripts.
It borrows the site's Google Fonts stylesheet, and otherwise loads only files
from this repo. AR runs entirely on the phone: the model file is handed to iOS
Quick Look or Android Scene Viewer, and nothing is uploaded.
