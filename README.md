# MCE 464 Geometric Tutorials

Interactive companions to the lecture slides of MCE 464 Vibrations (Fall 2026) at the University of Rhode Island, developed in the [Nonlinear Dynamics Laboratory (NLD)](https://web.uri.edu/nld/) by David Chelidze. Each page turns one algebraic result into a picture you can move. Parameters sit in a panel on the left; on a phone they sit in a bar pinned to the top of the screen.

**Live site:** https://dchelidze.github.io/mce464-tutorials/

## Layout

```text
.
├── index.html     # hub: Tutorials 1-14
├── T01_...html    # one self-contained page per tutorial (_v2 = revised version)
├── assets/
│   ├── style.css, layout.js, phonebar.js, math.js, lib.js, lib3d.js
│   └── katex/     # KaTeX 0.16.9, bundled (MIT, see assets/katex/LICENSE)
└── .nojekyll      # serve the files as they are on GitHub Pages
```

The pages need no build step and no network: open `index.html` locally or serve the folder.

## How to cite

GitHub's **Cite this repository** button (from `CITATION.cff`) gives APA and BibTeX. The same entries:

**IEEE**
D. Chelidze, *MCE 464 Geometric Tutorials: Interactive Companions to Vibrations Lectures*. Nonlinear Dynamics Laboratory, Univ. of Rhode Island, 2026. [Online]. Available: https://dchelidze.github.io/mce464-tutorials/

**APA**
Chelidze, D. (2026). *MCE 464 geometric tutorials: Interactive companions to vibrations lectures* [Interactive web tutorials]. Nonlinear Dynamics Laboratory, University of Rhode Island. https://dchelidze.github.io/mce464-tutorials/

**BibTeX**
```bibtex
@misc{chelidze2026mce464,
  author       = {Chelidze, David},
  title        = {{MCE} 464 Geometric Tutorials: Interactive Companions to Vibrations Lectures},
  year         = {2026},
  howpublished = {\url{https://dchelidze.github.io/mce464-tutorials/}},
  note         = {Nonlinear Dynamics Laboratory, University of Rhode Island. Interactive web tutorials}
}
```

A single tutorial: D. Chelidze, "Tutorial 5: One Curve, Many Machines," in *MCE 464 Geometric Tutorials*, Univ. of Rhode Island, 2026. [Online]. Available: the page's URL. Each page's footer carries its own citation line.

## Copyright and license

Copyright (c) 2026 David Chelidze, Nonlinear Dynamics Laboratory, University of Rhode Island. All rights reserved. The pages may be viewed, linked to and cited freely; copying, modifying or redistributing them requires written permission. KaTeX is distributed under its own MIT licence (`assets/katex/LICENSE`).
