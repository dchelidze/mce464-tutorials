# MCE 464 Geometric Tutorials

Interactive companions to the lecture slides of MCE 464 Vibrations (Fall 2026) at the University of Rhode Island, developed in the [Nonlinear Dynamics Laboratory (NLD)](https://web.uri.edu/nld/) by David Chelidze. Each page turns one algebraic result into a picture you can move. Parameters sit in a panel on the left; on a phone they sit in a bar pinned to the top of the screen.

**Live site:** https://dchelidze.github.io/mce464-tutorials/

## Layout

```text
.
├── index.html     # hub: Tutorials 1-14, plus the version 1 pages
├── T01_...html    # one self-contained page per tutorial (_v2 = current version)
├── assets/
│   ├── style.css, layout.js, phonebar.js, math.js, lib.js, lib3d.js
│   └── katex/     # KaTeX 0.16.9, bundled (MIT, see assets/katex/LICENSE)
└── .nojekyll      # serve the files as they are on GitHub Pages
```

The pages need no build step and no network: open `index.html` locally or serve the folder.

## License

Copyright (c) 2026 David Chelidze, Nonlinear Dynamics Laboratory, University of Rhode Island. All rights reserved. KaTeX is distributed under its own MIT licence (`assets/katex/LICENSE`).
